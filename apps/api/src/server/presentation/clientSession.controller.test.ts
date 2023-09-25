import {VpnClientSessionController} from './clientSession.controller';
import {VpnClientSession, VpnClientSessionService} from 'server/domain';
import {Test} from '@nestjs/testing';
import {buildMany} from 'test';
import {faker} from '@faker-js/faker';

describe('UserController', () => {
  let userId: string;
  let sessions: VpnClientSession[];

  let clientSessionController: VpnClientSessionController;
  let mockClientSessionService: Partial<VpnClientSessionService>;

  beforeEach(async () => {
    userId = faker.datatype.uuid();
    sessions = buildMany('vpnSession', 10, {userId});

    mockClientSessionService = {
      findByUserId: jest.fn().mockReturnValue({sessions, total: 100}),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [VpnClientSessionController],
      providers: [VpnClientSessionService],
    })
      .overrideProvider(VpnClientSessionService)
      .useValue(mockClientSessionService)
      .compile();

    clientSessionController = moduleRef.get<VpnClientSessionController>(VpnClientSessionController);
  });

  describe('listUser', () => {
    it('should run a query for the given parameters', async () => {
      await clientSessionController.listUser(userId, '25', '3');

      expect(mockClientSessionService.findByUserId).toHaveBeenCalledWith(userId, {
        limit: 25,
        page: 3,
      });
    });

    it('should run a query with default pagination parameters', async () => {
      await clientSessionController.listUser(userId);

      expect(mockClientSessionService.findByUserId).toHaveBeenCalledWith(userId, {
        limit: 10,
        page: 0,
      });
    });
  });
});
