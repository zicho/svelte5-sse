import { notificationEventEmitter, type MessagePayload, type NotificationEvent } from "$lib/utils/sse/EventHandler";

export async function GET() {
  let keepAliveInterval: NodeJS.Timeout;
  let messageListener: (data: NotificationEvent<MessagePayload>) => void;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // set upp all notification events and listeners
      messageListener = (data: NotificationEvent<MessagePayload>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      notificationEventEmitter.on('message', messageListener);


      // keeps connection alive by "heartbeart" every 20 secs
      keepAliveInterval = setInterval(() => {
        // Sending a comment line as a keep-alive message
        controller.enqueue(encoder.encode(":keep-alive\n\n"));
      }, 20000);
    },
    cancel() {
      clearInterval(keepAliveInterval);
      notificationEventEmitter.off('message', messageListener);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}