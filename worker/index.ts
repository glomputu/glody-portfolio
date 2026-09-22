import {
  contactSchemaPostUpgradeStatements,
  contactSchemaStatements,
  contactSchemaUpgradeStatements,
} from '../db/schema';
import {
  deliverContactEmails,
  type ContactEmailEnv,
  type ContactEmailRecord,
  type DeliveryResult,
} from './email';

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface AssetFetcher {
  fetch(request: Request | URL): Promise<Response>;
}

interface Env extends ContactEmailEnv {
  DB: D1Database;
  ASSETS: AssetFetcher;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
  locale?: unknown;
  submissionId?: unknown;
}

interface StoredContact {
  id: string;
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
  locale: 'fr' | 'en';
  createdAt: number;
  deliveryStatus: 'received' | 'email_sent' | 'email_partial' | 'email_failed';
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const CONTENT_SECURITY_POLICY = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
let schemaReady: Promise<void> | undefined;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function securedAssetResponse(response: Response, pathname: string) {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');

  if (pathname === '/images/profile/glodi-mputu.webp') headers.set('Content-Type', 'image/webp');
  if (pathname.startsWith('/assets/')) headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  else if (pathname.startsWith('/images/profile/')) headers.set('Cache-Control', 'public, max-age=2592000');
  else if (pathname.startsWith('/documents/')) headers.set('Cache-Control', 'public, max-age=86400, must-revalidate');
  else if (pathname === '/og.jpg') headers.set('Cache-Control', 'public, max-age=604800');
  else if (pathname === '/boot.js') headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function hashAddress(request: Request) {
  const address = request.headers.get('CF-Connecting-IP') ?? 'unavailable';
  const bytes = new TextEncoder().encode(`glodi-contact-v2:${address}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function ensureSchema(database: D1Database) {
  schemaReady ??= (async () => {
    await database.batch(contactSchemaStatements.map((statement) => database.prepare(statement)));
    for (const statement of contactSchemaUpgradeStatements) {
      try {
        await database.prepare(statement).run();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.toLowerCase().includes('duplicate column')) throw error;
      }
    }
    await database.batch(contactSchemaPostUpgradeStatements.map((statement) => database.prepare(statement)));
  })();
  return schemaReady;
}

function validate(payload: ContactPayload) {
  const value = {
    name: asString(payload.name),
    email: asString(payload.email).toLowerCase(),
    organization: asString(payload.organization),
    subject: asString(payload.subject),
    message: asString(payload.message),
    website: asString(payload.website),
    locale: payload.locale === 'en' ? 'en' as const : 'fr' as const,
    submissionId: asString(payload.submissionId),
    startedAt: typeof payload.startedAt === 'number' ? payload.startedAt : 0,
  };
  const valid = value.name.length >= 2 && value.name.length <= 80
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) && value.email.length <= 160
    && value.organization.length <= 120
    && value.subject.length >= 3 && value.subject.length <= 140
    && value.message.length >= 20 && value.message.length <= 2_000
    && /^[0-9a-f-]{36}$/i.test(value.submissionId)
    && value.startedAt > 0;
  return { valid, value };
}

async function updateDelivery(database: D1Database, id: string, delivery: DeliveryResult) {
  await database.prepare(
    `UPDATE contact_messages
      SET delivery_status = ?, owner_email_status = ?, visitor_email_status = ?,
          owner_email_id = ?, visitor_email_id = ?, email_last_error = ?, email_attempted_at = ?
      WHERE id = ?`,
  ).bind(
    delivery.status,
    delivery.ownerStatus,
    delivery.visitorStatus,
    delivery.ownerEmailId,
    delivery.visitorEmailId,
    delivery.lastError,
    Date.now(),
    id,
  ).run();
}

async function deliver(record: ContactEmailRecord, env: Env) {
  const delivery = await deliverContactEmails(record, env);
  await updateDelivery(env.DB, record.id, delivery);
  return delivery;
}

function deliveryResponse(delivery: DeliveryResult, successStatus = 201) {
  const complete = delivery.status === 'email_sent';
  return json(
    { ok: true, confirmationSent: delivery.visitorStatus === 'sent' },
    complete ? successStatus : 202,
  );
}

async function handleContact(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: { ...jsonHeaders, Allow: 'POST' },
    });
  }
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ ok: false, error: 'origin_rejected' }, 403);
  }
  const declaredLength = Number(request.headers.get('Content-Length') ?? 0);
  if (declaredLength > 16_384) return json({ ok: false, error: 'payload_too_large' }, 413);

  let payload: ContactPayload;
  try {
    const raw = await request.text();
    if (raw.length > 16_384) return json({ ok: false, error: 'payload_too_large' }, 413);
    payload = JSON.parse(raw) as ContactPayload;
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const { valid, value } = validate(payload);
  if (value.website) return json({ ok: true });
  if (!valid || Date.now() - value.startedAt < 1_500 || value.startedAt > Date.now()) {
    return json({ ok: false, error: 'validation_error' }, 400);
  }

  await ensureSchema(env.DB);
  const duplicate = await env.DB.prepare(
    `SELECT id, name, email, organization, subject, message, locale,
            created_at AS createdAt, delivery_status AS deliveryStatus
      FROM contact_messages WHERE id = ? LIMIT 1`,
  ).bind(value.submissionId).first<StoredContact>();

  if (duplicate) {
    if (duplicate.deliveryStatus === 'email_sent') {
      return json({ ok: true, confirmationSent: true });
    }
    return deliveryResponse(await deliver(duplicate, env), 200);
  }

  const ipHash = await hashAddress(request);
  const recent = await env.DB.prepare(
    'SELECT COUNT(*) AS count FROM contact_messages WHERE ip_hash = ? AND created_at >= ?',
  ).bind(ipHash, Date.now() - RATE_WINDOW_MS).first<{ count: number }>();
  if (Number(recent?.count ?? 0) >= RATE_LIMIT) {
    return json({ ok: false, error: 'rate_limited' }, 429);
  }

  const createdAt = Date.now();
  await env.DB.prepare(
    `INSERT INTO contact_messages (
      id, name, email, organization, subject, message, locale, created_at, ip_hash,
      delivery_status, owner_email_status, visitor_email_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', 'pending', 'pending')`,
  ).bind(
    value.submissionId,
    value.name,
    value.email,
    value.organization,
    value.subject,
    value.message,
    value.locale,
    createdAt,
    ipHash,
  ).run();

  const record: ContactEmailRecord = {
    id: value.submissionId,
    name: value.name,
    email: value.email,
    organization: value.organization,
    subject: value.subject,
    message: value.message,
    locale: value.locale,
    createdAt,
  };
  return deliveryResponse(await deliver(record, env));
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (url.pathname === '/api/media/profile.webp') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
      }
      const assetUrl = new URL('/images/profile/glodi-mputu.webp', request.url);
      return securedAssetResponse(await env.ASSETS.fetch(assetUrl), '/images/profile/glodi-mputu.webp');
    }
    return securedAssetResponse(await env.ASSETS.fetch(request), url.pathname);
  },
};
