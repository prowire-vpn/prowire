import {Injectable, Logger, Inject, forwardRef} from '@nestjs/common';
import {RawData} from 'ws';
import {MessageHandlersMap, HandlerFunction} from './message.service.interface';
import {deserialize} from 'bson';
import {WebSocketMessage} from '@prowire-vpn/api';
import {ApiGateway} from 'server/presentation';
import {OnEvent} from '@nestjs/event-emitter';
import {ServerReadyEvent, ByteCountMessage, ServerStopEvent} from 'open_vpn/infrastructure';

Injectable();
export class MessageService {
  handlers: MessageHandlersMap = {};

  constructor(
    @Inject(forwardRef(() => ApiGateway))
    private readonly apiGateway: ApiGateway,
  ) {}

  private readonly logger = new Logger(MessageService.name);

  /** Function called when a message is received from the API */
  onMessage(data: RawData): void {
    // If we receive an array, we process each message independently
    if (data instanceof Array) {
      data.forEach((element) => {
        this.onMessage(element);
      });
      return;
    }
    try {
      // Parse the message
      let message: WebSocketMessage;
      try {
        message = deserialize(data) as WebSocketMessage;
      } catch (error) {
        throw new Error('Could not parse incoming message as BSON');
      }

      // Check that the message type is handled
      if (!(message.type in this.handlers))
        throw new Error(`Message with type "${message.type}" is not handled by this server`);

      // Pass the message to tall the related handlers
      this.handlers[message.type].forEach((handler) => {
        handler(message.payload);
      });
    } catch (error: unknown) {
      this.logger.error(error);
    }
  }

  /** Add a message handler to the chain */
  registerHandler(type: string, handler: HandlerFunction): void {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.handlers[type].push(handler);
  }

  @OnEvent(ServerReadyEvent.eventName)
  sendServerReadyMessage(): void {
    this.apiGateway.send('server-ready');
  }

  @OnEvent(ServerStopEvent.eventName)
  sendServerStopMessage(): void {
    this.apiGateway.send('server-stop');
  }

  @OnEvent(ByteCountMessage.eventName)
  sendByteCountMessage(message: ByteCountMessage): void {
    this.apiGateway.send('byte-count', {bytesIn: message.bytesIn, bytesOut: message.bytesOut});
  }
}
