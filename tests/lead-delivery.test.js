const test = require('node:test');
const assert = require('node:assert/strict');
const { deliverLead } = require('../lead-delivery');
const lead = { date: '2026-12-04', venue: 'Москва', format: 'Конференция', contact: 'person@example.com', services: ['Фото'] };

test('does not claim delivery when webhook is unconfigured', async () => {
  const result = await deliverLead(lead, { webhookUrl: '', fetchImpl: async () => { throw Error('should not run'); } });
  assert.equal(result.delivered, false);
  assert.equal(result.reason, 'not_configured');
});
test('only acknowledges a successful webhook response', async () => {
  let received;
  const result = await deliverLead(lead, { webhookUrl: 'https://example.org/hook', fetchImpl: async (url, options) => {
    received = { url, options }; return { ok: true, status: 204 };
  }});
  assert.equal(result.delivered, true);
  assert.equal(received.url, 'https://example.org/hook');
  assert.equal(JSON.parse(received.options.body).contact, 'person@example.com');
});
test('does not claim delivery when webhook responds with an error status', async () => {
  const result = await deliverLead(lead, { webhookUrl: 'https://example.org/hook', fetchImpl: async () => ({ ok:false, status:500 }) });
  assert.equal(result.delivered, false);
  assert.equal(result.reason, 'webhook_rejected');
});
test('does not claim delivery when the network throws', async () => {
  const result = await deliverLead(lead, { webhookUrl: 'https://example.org/hook', fetchImpl: async () => { throw new Error('network'); } });
  assert.equal(result.delivered, false);
  assert.equal(result.reason, 'network_error');
});