import {VpnClientSessionRepository} from './clientSession.repository';
import {
  VpnClientSessionSchemaClass,
  VpnClientSessionSchema,
  VpnClientSessionModel,
} from './clientSession.schema';
import {Test, TestingModule} from '@nestjs/testing';
import {build, create, createMany} from 'test';
import {faker} from '@faker-js/faker';
import {ObjectId} from 'bson';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule, getModelToken} from '@nestjs/mongoose';

/**
 * Tests VpnClientSessionRepository class
 * @group integration
 */
describe('VpnClientSessionRepository', () => {
  let module: TestingModule;
  let sessionRepository: VpnClientSessionRepository;
  let sessionModel: VpnClientSessionModel;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: configService.getOrThrow<string>('MONGO_CONNECTION_STRING'),
            user: configService.get<string>('MONGO_USER'),
            pass: configService.get<string>('MONGO_PASSWORD'),
            dbName: configService.get<string>('MONGO_DATABASE'),
          }),
        }),
        MongooseModule.forFeature([
          {name: VpnClientSessionSchemaClass.name, schema: VpnClientSessionSchema},
        ]),
      ],
      providers: [VpnClientSessionRepository],
    }).compile();
    sessionRepository = module.get<VpnClientSessionRepository>(VpnClientSessionRepository);
    sessionModel = module.get<VpnClientSessionModel>(
      getModelToken(VpnClientSessionSchemaClass.name),
    );
  });

  afterEach(async () => {
    await module.close();
  });

  describe('persist', () => {
    it('should store a new session', async () => {
      const session = build('vpnSession');

      await sessionRepository.persist(session);

      const storedSession = await sessionModel.findById(session.id);
      expect(storedSession).not.toBeNull();
      expect(storedSession?.userId).toBe(session.userId);
    });

    it('should update an existing session', async () => {
      const session = await create('vpnSession', {bytesIn: 0});
      session.bytesIn = 100;

      await sessionRepository.persist(session);

      const storedSession = await sessionModel.findById(session.id);
      expect(storedSession).not.toBeNull();
      expect(storedSession?.bytesIn).toBe(100);
    });
  });

  describe('get', () => {
    it('should return a session if it exists', async () => {
      const session = await create('vpnSession');

      const storedSession = await sessionRepository.get(session.id);

      expect(storedSession).not.toBeNull();
      expect(storedSession?.id).toBe(session.id);
    });

    it('should return null if the session does not exist', async () => {
      const storedSession = await sessionRepository.get(new ObjectId().toHexString());

      expect(storedSession).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return sessions for the user', async () => {
      const userId = faker.datatype.uuid();
      await createMany('vpnSession', 3, {userId});

      const {sessions: storedSessions} = await sessionRepository.findByUserId(userId, {
        limit: 10,
        page: 0,
      });

      expect(storedSessions).toHaveLength(3);
    });

    it('should not return sessions for another user', async () => {
      const userId = faker.datatype.uuid();
      await createMany('vpnSession', 3, {userId});

      const {sessions: storedSessions} = await sessionRepository.findByUserId(
        new ObjectId().toHexString(),
        {
          limit: 10,
          page: 0,
        },
      );

      expect(storedSessions).toHaveLength(0);
    });

    it('should return the total number of sessions for the user', async () => {
      const userId = faker.datatype.uuid();
      await createMany('vpnSession', 3, {userId});

      const {total} = await sessionRepository.findByUserId(userId, {
        limit: 10,
        page: 0,
      });

      expect(total).toBe(3);
    });

    it('should not retune the total of sessions for another user', async () => {
      const userId = faker.datatype.uuid();
      await createMany('vpnSession', 3, {userId});

      const {total} = await sessionRepository.findByUserId(new ObjectId().toHexString(), {
        limit: 10,
        page: 0,
      });

      expect(total).toBe(0);
    });

    it('should return the total number of sessions for the user even if the limit is lower', async () => {
      const userId = faker.datatype.uuid();
      await createMany('vpnSession', 3, {userId});

      const {total} = await sessionRepository.findByUserId(userId, {
        limit: 2,
        page: 0,
      });

      expect(total).toBe(3);
    });

    it('should return sessions in descending order of creation', async () => {
      const userId = faker.datatype.uuid();
      const sessions = await createMany('vpnSession', 3, {userId});

      const {sessions: storedSessions} = await sessionRepository.findByUserId(userId, {
        limit: 10,
        page: 0,
      });

      expect(storedSessions).toHaveLength(3);
      expect(storedSessions[0].id).toBe(sessions[2].id);
      expect(storedSessions[1].id).toBe(sessions[1].id);
      expect(storedSessions[2].id).toBe(sessions[0].id);
    });

    it('should return sessions in pages', async () => {
      const userId = faker.datatype.uuid();
      await createMany('vpnSession', 3, {userId});

      const {sessions: storedSessions} = await sessionRepository.findByUserId(userId, {
        limit: 2,
        page: 1,
      });

      expect(storedSessions).toHaveLength(1);
    });
  });
});
