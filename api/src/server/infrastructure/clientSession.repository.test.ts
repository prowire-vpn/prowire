import {VpnClientSessionRepository} from './clientSession.repository';
import {
  VpnClientSessionSchemaClass,
  VpnClientSessionSchema,
  VpnClientSessionModel,
} from './clientSession.schema';
import {MongooseModule, getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {build, create} from 'test';

describe('VpnClientSessionRepository', () => {
  let module: TestingModule;
  let mongod: MongoMemoryServer;
  let sessionRepository: VpnClientSessionRepository;
  let sessionModel: VpnClientSessionModel;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
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
    await mongod.stop();
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
});
