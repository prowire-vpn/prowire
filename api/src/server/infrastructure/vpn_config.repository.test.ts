import {MongooseModule, getModelToken} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {
  VpnConfigRepository,
  VpnConfigSchemaClass,
  VpnConfigSchema,
  VpnConfigModel,
} from 'server/infrastructure';
import {build, buildMany, create} from 'test/factory';
import {MongoMemoryServer} from 'mongodb-memory-server';

describe('VpnConfigRepository', () => {
  let module: TestingModule;
  let mongod: MongoMemoryServer;
  let vpnConfigRepository: VpnConfigRepository;
  let vpnConfigModel: VpnConfigModel;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([{name: VpnConfigSchemaClass.name, schema: VpnConfigSchema}]),
      ],
      providers: [VpnConfigRepository],
    }).compile();
    vpnConfigRepository = module.get<VpnConfigRepository>(VpnConfigRepository);
    vpnConfigModel = module.get<VpnConfigModel>(getModelToken(VpnConfigSchemaClass.name));
  });

  afterEach(async () => {
    await module.close();
    await mongod.stop();
  });

  describe('persist', () => {
    it('should persist a config', async () => {
      const config = await build('vpnConfig');

      await vpnConfigRepository.persist(config);

      const result = await vpnConfigModel.find();
      expect(result).toHaveLength(1);
      expect(result?.[0]?.subnet.ip).toBe(config.subnet.ip);
    });

    it('should only have one config stored', async () => {
      const configs = await buildMany('vpnConfig', 2);

      await vpnConfigRepository.persist(configs[0]);
      await vpnConfigRepository.persist(configs[1]);

      const result = await vpnConfigModel.find();
      expect(result).toHaveLength(1);
      expect(result[0]?.subnet.ip).toBe(configs[1].subnet.ip);
    });
  });

  describe('get', () => {
    it('should return a default config is none is set', async () => {
      const result = await vpnConfigRepository.get();

      expect(result).not.toBeNull();
      expect(result?.subnet.ip).toBe('10.8.0.0');
    });

    it('should return a create config', async () => {
      const config = await create('vpnConfig');

      const result = await vpnConfigRepository.get();

      expect(result).not.toBeNull();
      expect(result?.subnet.ip).toBe(config.subnet.ip);
    });
  });
});
