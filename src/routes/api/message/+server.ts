import { notificationEventEmitter, type MessagePayload } from '$lib/utils/sse/EventHandler';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { test } = body;

  const msg: MessagePayload = {
    content: test
  };

  notificationEventEmitter?.emit<MessagePayload>('message', msg);

  return new Response();
};