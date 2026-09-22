import assert from 'node:assert/strict';
import { deliverContactEmails } from '../worker/email.ts';

const record = {
  id: 'a8e54b51-bf8d-4f5c-a719-c589a4dd5d4e',
  name: 'Amina <script>alert(1)</script>',
  email: 'amina@example.com',
  organization: 'Organisation test',
  subject: 'Application de gestion',
  message: 'Bonjour, je souhaite échanger au sujet de cette application.',
  locale: 'fr',
  createdAt: Date.parse('2026-08-26T08:00:00.000Z'),
};

const env = {
  RESEND_API_KEY: 're_test_only',
  RESEND_API_URL: 'https://resend.test/emails',
  CONTACT_TO_EMAIL: 'owner@example.com',
  CONTACT_FROM_EMAIL: 'GloDi MPUTU <contact@example.com>',
};

const calls = [];
const successFetch = async (url, options) => {
  calls.push({ url, options, body: JSON.parse(options.body) });
  return new Response(JSON.stringify({ id: `email-${calls.length}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

const delivered = await deliverContactEmails(record, env, successFetch);
assert.equal(delivered.status, 'email_sent');
assert.equal(delivered.ownerStatus, 'sent');
assert.equal(delivered.visitorStatus, 'sent');
assert.equal(calls.length, 2);

const owner = calls.find((call) => call.body.to[0] === 'owner@example.com');
const visitor = calls.find((call) => call.body.to[0] === record.email);
assert.ok(owner, 'owner notification must be sent');
assert.ok(visitor, 'visitor acknowledgement must be sent');
assert.equal(owner.body.subject, 'Nouvelle demande depuis glodimputu portfolio');
assert.equal(owner.body.reply_to, record.email);
assert.match(owner.body.text, /Identifiant de la demande/);
assert.doesNotMatch(owner.body.html, /<script>/);
assert.match(owner.body.html, /&lt;script&gt;/);
assert.equal(visitor.body.reply_to, 'owner@example.com');
assert.equal(visitor.body.subject, "J'ai bien reçu votre message — GloDi MPUTU");
assert.match(owner.options.headers['Idempotency-Key'], /^contact-owner\//);
assert.match(visitor.options.headers['Idempotency-Key'], /^contact-visitor\//);

const englishCalls = [];
await deliverContactEmails(
  { ...record, locale: 'en' },
  env,
  async (_url, options) => {
    englishCalls.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ id: `english-${englishCalls.length}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
);
assert.equal(
  englishCalls.find((message) => message.to[0] === record.email).subject,
  'I received your message — GloDi MPUTU',
);

let requestNumber = 0;
const partial = await deliverContactEmails(record, env, async () => {
  requestNumber += 1;
  return requestNumber === 1
    ? new Response('provider unavailable', { status: 503 })
    : new Response(JSON.stringify({ id: 'visitor-sent' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
});
assert.equal(partial.status, 'email_partial');
assert.equal(partial.ownerStatus, 'failed');
assert.equal(partial.visitorStatus, 'sent');

const missingConfiguration = await deliverContactEmails(record, {}, successFetch);
assert.equal(missingConfiguration.status, 'email_failed');
assert.equal(missingConfiguration.lastError, 'email_configuration_missing');

console.log('Email delivery: owner notification, Reply-To, bilingual acknowledgement, escaping, idempotency and provider failure handling passed.');
