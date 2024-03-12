import { appEvents } from "$lib/utils/appEvents";

export async function GET({ request }) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            // Subscribe to the event
            const updateListener = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            appEvents.on('message', updateListener);

            // Implementing keep-alive
            const keepAliveInterval = setInterval(() => {
                // Sending a comment line as a keep-alive message
                controller.enqueue(encoder.encode(":keep-alive\n\n"));
            }, 20000);

            // Clean up when the stream is closed
            request.signal.addEventListener('abort', () => {
                console.log("closed");
                clearInterval(keepAliveInterval); // Stop the keep-alive messages
                appEvents.off('message', updateListener);
                controller.close();
            });
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