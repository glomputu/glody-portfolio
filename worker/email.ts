export interface ContactEmailEnv {
  RESEND_API_KEY?: string;
  RESEND_API_URL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

export interface ContactEmailRecord {
  id: string;
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
  locale: 'fr' | 'en';
  createdAt: number;
}

export interface DeliveryResult {
  status: 'email_sent' | 'email_partial' | 'email_failed';
  ownerStatus: 'sent' | 'failed';
  visitorStatus: 'sent' | 'failed';
  ownerEmailId: string;
  visitorEmailId: string;
  lastError: string;
}

type Fetcher = typeof fetch;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function htmlLines(value: string) {
  return escapeHtml(value).replaceAll('\n', '<br />');
}

function emailConfiguration(env: ContactEmailEnv) {
  const apiKey = env.RESEND_API_KEY?.trim();
  const ownerEmail = env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !ownerEmail || !fromEmail) return null;
  return {
    apiKey,
    ownerEmail,
    fromEmail,
    apiUrl: env.RESEND_API_URL?.trim() || 'https://api.resend.com/emails',
  };
}

async function sendEmail(
  configuration: NonNullable<ReturnType<typeof emailConfiguration>>,
  payload: Record<string, unknown>,
  idempotencyKey: string,
  fetcher: Fetcher,
) {
  const response = await fetcher(configuration.apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`resend_http_${response.status}`);
  const body = await response.json() as { id?: string };
  if (!body.id) throw new Error('resend_invalid_response');
  return body.id;
}

function ownerMessage(record: ContactEmailRecord) {
  const date = new Date(record.createdAt).toISOString();
  const organization = record.organization || 'Non renseignée';
  const text = [
    'Nouvelle demande depuis glodimputu portfolio',
    '',
    `Nom : ${record.name}`,
    `Email : ${record.email}`,
    `Organisation : ${organization}`,
    `Sujet : ${record.subject}`,
    '',
    'Message :',
    record.message,
    '',
    `Date : ${date}`,
    `Identifiant de la demande : ${record.id}`,
  ].join('\n');

  return {
    subject: 'Nouvelle demande depuis glodimputu portfolio',
    text,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#17231d;line-height:1.6">
        <h1 style="font-size:22px;color:#0b1320">Nouvelle demande depuis glodimputu portfolio</h1>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:7px 0;font-weight:700">Nom</td><td>${escapeHtml(record.name)}</td></tr>
          <tr><td style="padding:7px 0;font-weight:700">Email</td><td>${escapeHtml(record.email)}</td></tr>
          <tr><td style="padding:7px 0;font-weight:700">Organisation</td><td>${escapeHtml(organization)}</td></tr>
          <tr><td style="padding:7px 0;font-weight:700">Sujet</td><td>${escapeHtml(record.subject)}</td></tr>
        </table>
        <h2 style="font-size:16px;margin-top:24px">Message</h2>
        <div style="padding:16px;background:#f0f5f1;border-left:3px solid #0a7f58">${htmlLines(record.message)}</div>
        <p style="font-size:13px;color:#53635a;margin-top:24px">Date : ${date}<br />Identifiant de la demande : ${escapeHtml(record.id)}</p>
      </div>`,
  };
}

function visitorMessage(record: ContactEmailRecord) {
  if (record.locale === 'en') {
    return {
      subject: 'I received your message — GloDi MPUTU',
      text: [
        `Hello ${record.name},`,
        '',
        'Thank you for your message.',
        `I received your enquiry about “${record.subject}”.`,
        'I will review your message and reply as soon as possible.',
        '',
        'Kind regards,',
        '',
        'GloDi MPUTU',
        'Software Engineer',
        'Back-End Developer · IT Manager',
        '',
        'This is an automatic confirmation email.',
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#17231d;line-height:1.7">
          <h1 style="font-size:22px;color:#0b1320">Hello ${escapeHtml(record.name)},</h1>
          <p>Thank you for your message.</p>
          <p>I received your enquiry about <strong>“${escapeHtml(record.subject)}”</strong>.</p>
          <p>I will review your message and reply as soon as possible.</p>
          <p style="margin-top:28px">Kind regards,</p>
          <p><strong>GloDi MPUTU</strong><br />Software Engineer<br />Back-End Developer · IT Manager</p>
          <p style="font-size:12px;color:#53635a;margin-top:28px">This is an automatic confirmation email.</p>
        </div>`,
    };
  }

  return {
    subject: "J'ai bien reçu votre message — GloDi MPUTU",
    text: [
      `Bonjour ${record.name},`,
      '',
      'Merci pour votre message.',
      `J'ai bien reçu votre demande concernant « ${record.subject} ».`,
      'Je prendrai connaissance de votre message et je vous répondrai dès que possible.',
      '',
      'Bien cordialement,',
      '',
      'GloDi MPUTU',
      'Software Engineer',
      'Back-End Developer · IT Manager',
      '',
      'Ce message est un accusé de réception automatique.',
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#17231d;line-height:1.7">
        <h1 style="font-size:22px;color:#0b1320">Bonjour ${escapeHtml(record.name)},</h1>
        <p>Merci pour votre message.</p>
        <p>J'ai bien reçu votre demande concernant <strong>« ${escapeHtml(record.subject)} »</strong>.</p>
        <p>Je prendrai connaissance de votre message et je vous répondrai dès que possible.</p>
        <p style="margin-top:28px">Bien cordialement,</p>
        <p><strong>GloDi MPUTU</strong><br />Software Engineer<br />Back-End Developer · IT Manager</p>
        <p style="font-size:12px;color:#53635a;margin-top:28px">Ce message est un accusé de réception automatique.</p>
      </div>`,
  };
}

export async function deliverContactEmails(
  record: ContactEmailRecord,
  env: ContactEmailEnv,
  fetcher: Fetcher = fetch,
): Promise<DeliveryResult> {
  const configuration = emailConfiguration(env);
  if (!configuration) {
    return {
      status: 'email_failed',
      ownerStatus: 'failed',
      visitorStatus: 'failed',
      ownerEmailId: '',
      visitorEmailId: '',
      lastError: 'email_configuration_missing',
    };
  }

  const owner = ownerMessage(record);
  const visitor = visitorMessage(record);
  const [ownerResult, visitorResult] = await Promise.allSettled([
    sendEmail(configuration, {
      from: configuration.fromEmail,
      to: [configuration.ownerEmail],
      reply_to: record.email,
      ...owner,
    }, `contact-owner/${record.id}`, fetcher),
    sendEmail(configuration, {
      from: configuration.fromEmail,
      to: [record.email],
      reply_to: configuration.ownerEmail,
      ...visitor,
    }, `contact-visitor/${record.id}`, fetcher),
  ]);

  const ownerSent = ownerResult.status === 'fulfilled';
  const visitorSent = visitorResult.status === 'fulfilled';
  const errors = [ownerResult, visitorResult]
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => result.reason instanceof Error ? result.reason.message : 'email_provider_error');

  return {
    status: ownerSent && visitorSent ? 'email_sent' : ownerSent || visitorSent ? 'email_partial' : 'email_failed',
    ownerStatus: ownerSent ? 'sent' : 'failed',
    visitorStatus: visitorSent ? 'sent' : 'failed',
    ownerEmailId: ownerSent ? ownerResult.value : '',
    visitorEmailId: visitorSent ? visitorResult.value : '',
    lastError: errors.join(',').slice(0, 180),
  };
}
