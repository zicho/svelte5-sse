import { EventEmitter } from 'events';

export const EventTypes = {
  Message: "message"
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes]

export type NotificationEvent<T> = {
  type: EventType;
  payload: T
}

export type MessagePayload = {
  content: string;
}

class NotificationEventEmitter extends EventEmitter {
  // Override the on method
  on<T>(eventName: EventType, listener: (data: T) => void): this {
    super.on(eventName, listener);
    return this; // Return this for chaining
  }

  emit<T>(eventName: EventType, data: T): boolean {
    return super.emit(eventName, data);
  }
}

export const notificationEventEmitter = new NotificationEventEmitter();
