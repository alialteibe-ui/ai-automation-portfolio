type IncomingWebhook = {
  event: string;
  phone?: string;
  messageId?: string;
  payload?: unknown;
};

export type WebhookResult =
  | { status: 200; body: { accepted: true; event: string } }
  | { status: 400; body: { accepted: false; error: string } }
  | { status: 401; body: { accepted: false; error: string } };

export function handleWebhook(
  secretHeader: string | null,
  expectedSecret: string,
  body: unknown,
): WebhookResult {
  if (!secretHeader || secretHeader !== expectedSecret) {
    return { status: 401, body: { accepted: false, error: 'unauthorized' } };
  }

  if (!body || typeof body !== 'object') {
    return { status: 400, body: { accepted: false, error: 'invalid JSON body' } };
  }

  const event = (body as IncomingWebhook).event;
  if (!event || typeof event !== 'string') {
    return { status: 400, body: { accepted: false, error: 'missing event' } };
  }

  // In production: validate the event-specific schema, persist an idempotency key,
  // then enqueue or process the business action.
  return { status: 200, body: { accepted: true, event } };
}
