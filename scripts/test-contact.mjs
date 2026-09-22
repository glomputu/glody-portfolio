import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const endpoint = `${(process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')}/api/contact`;
const rateKey = `198.51.100.${Math.floor(Math.random() * 180) + 20}`;

const validPayload = () => ({
  name: 'Test Portfolio',
  email: 'test@example.com',
  organization: 'QA locale',
  subject: 'Vérification du formulaire',
  message: 'Ce message généré localement vérifie le traitement du formulaire de contact.',
  website: '',
  startedAt: Date.now() - 2_000,
  locale: 'fr',
  submissionId: randomUUID(),
});

async function send(body) {
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': rateKey },
    body: JSON.stringify(body),
  });
}

const invalid = await send({});
assert.equal(invalid.status, 400, 'invalid payload must be rejected');

const honeypot = await send({ ...validPayload(), website: 'bot.example' });
assert.equal(honeypot.status, 200, 'honeypot must get a neutral response');

const firstPayload = validPayload();
const first = await send(firstPayload);
assert.equal(first.status, 202, 'valid payload must be stored even when email is not configured locally');
assert.equal((await first.json()).confirmationSent, false, 'local response must not claim that an email was sent');

const duplicate = await send(firstPayload);
assert.equal(duplicate.status, 202, 'duplicate submission must remain idempotent while delivery is pending');

for (let index = 0; index < 4; index += 1) {
  const response = await send(validPayload());
  assert.equal(response.status, 202, `rate-limit setup request ${index + 1} must be stored`);
}

const limited = await send(validPayload());
assert.equal(limited.status, 429, 'sixth request in the window must be rate-limited');

console.log('Contact API: validation, honeypot, idempotency, persistence, graceful email failure and rate limiting passed.');
