import { EventTypes, type MessagePayload } from "./EventHandler";

export default class SSEClient {
  private static eventSource: EventSource | null = null;

  static openConnection(url: string): void {
    if (SSEClient.eventSource) {
      console.log("Connection already exists. Please close the current connection before opening a new one.");
      return;
    }

    SSEClient.eventSource = new EventSource(url);

    SSEClient.eventSource.onmessage = function (event) {
      // Handle incoming messages

      if (!event.type) {
        throw new Error("Event lacks type")
      }

      switch (event.type) {
        case EventTypes.Message:
          return handleMessageEvent(event.data as MessagePayload);
        default:
          throw new Error("Event lacks valid type")
      }
    };

    SSEClient.eventSource.onerror = function () {
      console.log("SSE error, attempting to reconnect...");
      SSEClient.eventSource?.close();
      SSEClient.eventSource = null;
    };

    SSEClient.eventSource.onopen = function () {
      console.log("SSE connection established");
    };
  }

  static closeConnection(): void {
    if (SSEClient.eventSource) {
      SSEClient.eventSource.close();
      SSEClient.eventSource = null;
      console.log("SSE connection closed");
    } else {
      console.log("No active SSE connection to close.");
    }
  }
}

function handleMessageEvent(data: MessagePayload) {
  console.dir(data);
}