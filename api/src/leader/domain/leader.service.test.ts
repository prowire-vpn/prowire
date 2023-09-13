import {Test} from '@nestjs/testing';
import {LeaderService} from './leader.service';
import {LeaderRepository} from 'leader/infrastructure';
import {EventEmitter2} from '@nestjs/event-emitter';
import {BecameLeaderEvent, LostLeadershipEvent} from './leader.events';

describe('LeaderService', () => {
  let mockLeaderRepository: Partial<LeaderRepository>;
  let mockEventEmitter2: Partial<EventEmitter2>;

  let leaderService: LeaderService;

  beforeEach(async () => {
    mockLeaderRepository = {
      getCurrentLeader: jest.fn(async () => null),
      attemptTakeLock: jest.fn(async () => false),
      renewLock: jest.fn(async () => true),
    };

    mockEventEmitter2 = {
      emit: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [LeaderService, LeaderRepository, EventEmitter2],
    })
      .overrideProvider(LeaderRepository)
      .useValue(mockLeaderRepository)
      .overrideProvider(EventEmitter2)
      .useValue(mockEventEmitter2)
      .compile();

    leaderService = moduleRef.get<LeaderService>(LeaderService);
  });

  it('should not do anything if it is not leader and did not take the lock', async () => {
    leaderService.isLeader = false;

    await leaderService.elect();

    expect(mockLeaderRepository.attemptTakeLock).toHaveBeenCalledTimes(1);
    expect(mockLeaderRepository.renewLock).not.toHaveBeenCalled();
    expect(mockEventEmitter2.emit).not.toHaveBeenCalled();
    expect(leaderService.isLeader).toBe(false);
  });

  it('it should emit an event when it is able to take leadership', async () => {
    leaderService.isLeader = false;
    mockLeaderRepository.attemptTakeLock = jest.fn(async () => true);

    await leaderService.elect();

    expect(mockLeaderRepository.attemptTakeLock).toHaveBeenCalledTimes(1);
    expect(mockLeaderRepository.renewLock).not.toHaveBeenCalled();
    expect(mockEventEmitter2.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter2.emit).toHaveBeenCalledWith(
      BecameLeaderEvent.namespace,
      new BecameLeaderEvent(),
    );
    expect(leaderService.isLeader).toBe(true);
  });

  it('should not do anything if it is lader and successfully renewed', async () => {
    leaderService.isLeader = true;

    await leaderService.elect();

    expect(mockLeaderRepository.attemptTakeLock).not.toHaveBeenCalled();
    expect(mockLeaderRepository.renewLock).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter2.emit).not.toHaveBeenCalled();
    expect(leaderService.isLeader).toBe(true);
  });

  it('should emit an event when it lost leadership', async () => {
    leaderService.isLeader = true;
    mockLeaderRepository.renewLock = jest.fn(async () => false);

    await leaderService.elect();

    expect(mockLeaderRepository.attemptTakeLock).not.toHaveBeenCalled();
    expect(mockLeaderRepository.renewLock).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter2.emit).toHaveBeenCalledTimes(1);
    expect(mockEventEmitter2.emit).toHaveBeenCalledWith(
      LostLeadershipEvent.namespace,
      new LostLeadershipEvent(),
    );
    expect(leaderService.isLeader).toBe(false);
  });
});
