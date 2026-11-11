'use strict';
/** Report a successful lead only after an acknowledged delivery. */
async function deliverLead(lead, { webhookUrl = process.env.LEAD_WEBHOOK_URL, fetchImpl = globalThis.fetch } = {}) {
  if (!webhookUrl) return { delivered: false, reason: 'not_configured' };
  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { delivered: false, reason: 'webhook_rejected' };
    return { delivered: true };
  } catch (_) {
    return { delivered: false, reason: 'network_error' };
  }
}
module.exports = { deliverLead };