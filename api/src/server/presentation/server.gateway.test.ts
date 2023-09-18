import {ServerGateway, ExtendedWebSocket} from './server.gateway';
import {ServerConnectedEvent, ServerDisconnectedEvent} from 'server/domain';
import {Test} from '@nestjs/testing';
import {IncomingMessage} from 'http';
import {EventEmitter2} from '@nestjs/event-emitter';
import {faker} from '@faker-js/faker';
import {serialize} from 'bson';

describe('ServerGateway', () => {
  let serverGateway: ServerGateway;
  let mockEventEmitter: Partial<EventEmitter2>;

  let socket: ExtendedWebSocket;
  let name: string;
  let ip: string;
  let port: number;
  let publicKey: string;
  let headers: Record<string, string>;
  let request: IncomingMessage;

  beforeEach(async () => {
    name = faker.lorem.slug();
    ip = faker.internet.ip();
    port = faker.internet.port();
    publicKey = faker.lorem.paragraph();

    headers = {
      'x-prowire-server-name': name,
      'x-prowire-server-ip': ip,
      'x-prowire-server-port': port.toString(),
      'x-prowire-server-public-key': Buffer.from(publicKey, 'utf-8').toString('base64'),
    };

    request = {headers} as unknown as IncomingMessage;

    socket = {
      close: jest.fn(),
      on: jest.fn(),
      name,
    } as unknown as ExtendedWebSocket;

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [ServerGateway, EventEmitter2],
    })
      .overrideProvider(EventEmitter2)
      .useValue(mockEventEmitter)
      .compile();

    serverGateway = moduleRef.get<ServerGateway>(ServerGateway);
  });

  describe('handleConnection', () => {
    it('should close the connection if the headers can not be validated', async () => {
      const request = {
        headers: {},
      } as unknown as IncomingMessage;

      await serverGateway.handleConnection(socket, request);

      expect(socket.close).toHaveBeenCalled();
    });

    it('should not close the connection if the headers are valid', async () => {
      await serverGateway.handleConnection(socket, request);

      expect(socket.close).not.toHaveBeenCalled();
    });

    it('should not store the socket if the headers are invalid', async () => {
      const request = {
        headers: {},
      } as unknown as IncomingMessage;

      await serverGateway.handleConnection(socket, request);

      expect(serverGateway.clientCount).toEqual(0);
    });

    it('should store the socket', async () => {
      await serverGateway.handleConnection(socket, request);

      expect(serverGateway.clientCount).toEqual(1);
      expect(serverGateway['clients'][name]).toBe(socket);
    });

    it('should not emit a ServerConnectedEvent if the headers are invalid', async () => {
      const request = {
        headers: {},
      } as unknown as IncomingMessage;

      await serverGateway.handleConnection(socket, request);

      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should emit a ServerConnectedEvent', async () => {
      await serverGateway.handleConnection(socket, request);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        ServerConnectedEvent.namespace,
        new ServerConnectedEvent({
          name,
          ip,
          port,
          publicKey,
        }),
      );
    });

    it('should register a pong listener', async () => {
      await serverGateway.handleConnection(socket, request);

      expect(socket.on).toHaveBeenCalledWith('pong', expect.any(Function));
    });
  });

  describe('handleDisconnect', () => {
    it('should emit a ServerDisconnectedEvent', async () => {
      await serverGateway.handleConnection(socket, request);
      await serverGateway.handleDisconnect(socket);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        ServerDisconnectedEvent.namespace,
        new ServerDisconnectedEvent(name),
      );
    });

    it('should remove socket from the store', async () => {
      await serverGateway.handleConnection(socket, request);
      await serverGateway.handleDisconnect(socket);

      expect(serverGateway.clientCount).toEqual(0);
    });
  });

  describe('onMessage', () => {
    it('should call a registered listener', () => {
      const listener = jest.fn();
      const type = faker.lorem.slug();
      const payload = faker.lorem.paragraph();
      const message = serialize({type, payload});

      serverGateway.registerHandler(type, listener);
      serverGateway['onMessage'](message, socket);

      expect(listener).toHaveBeenCalledWith(name, payload);
    });

    it('should not call a listener registered on another topic', () => {
      const listener = jest.fn();
      const type = faker.lorem.slug();
      const payload = faker.lorem.paragraph();
      const message = serialize({type: 'wrong', payload});

      serverGateway.registerHandler(type, listener);
      serverGateway.registerHandler('wrong', () => ({}));
      serverGateway['onMessage'](message, socket);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should call multiple registered listener', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const type = faker.lorem.slug();
      const payload = faker.lorem.paragraph();
      const message = serialize({type, payload});

      serverGateway.registerHandler(type, listener1);
      serverGateway.registerHandler(type, listener2);
      serverGateway['onMessage'](message, socket);

      expect(listener1).toHaveBeenCalledWith(name, payload);
      expect(listener2).toHaveBeenCalledWith(name, payload);
    });

    it('should pass an array of messages in multiple calls to the listener', () => {
      const listener = jest.fn();
      const type = faker.lorem.slug();
      const payload1 = faker.lorem.paragraph();
      const payload2 = faker.lorem.paragraph();
      const message1 = serialize({type, payload: payload1});
      const message2 = serialize({type, payload: payload2});

      serverGateway.registerHandler(type, listener);
      serverGateway['onMessage'](message1, socket);
      serverGateway['onMessage'](message2, socket);

      expect(listener).toHaveBeenCalledWith(name, payload1);
      expect(listener).toHaveBeenCalledWith(name, payload2);
    });
  });
});
