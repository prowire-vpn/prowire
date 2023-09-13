import {Injectable} from '@nestjs/common';
import {Interval} from '@nestjs/schedule';
import {LeaderRepository} from 'app/infrastructure';
import {EventEmitter2} from '@nestjs/event-emitter';
import {BecameLeaderEvent, LostLeadershipEvent} from './leader.events';

/**
 * This service is the core of the leader election system.
 * Every second, it attempts to take a lock on the leader key in Redis.
 * If it succeeds, it means that this server is the leader.
 */
@Injectable()
export class LeaderService {
  public isLeader = false;

  constructor(
    private readonly leaderRepository: LeaderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Interval(1000)
  async elect() {
    if (this.isLeader) {
      await this.renewLeadership();
      return;
    }

    const tookLeadership = await this.leaderRepository.attemptTakeLock('prowire', 5);
    if (tookLeadership) await this.takeLeadership();
  }

  private async renewLeadership() {
    const success = await this.leaderRepository.renewLock('prowire', 5);
    if (!success) await this.releaseLeadership();
  }

  private async takeLeadership() {
    this.isLeader = true;
    this.eventEmitter.emit(BecameLeaderEvent.namespace, new BecameLeaderEvent());
  }

  private async releaseLeadership() {
    this.isLeader = false;
    this.eventEmitter.emit(LostLeadershipEvent.namespace, new LostLeadershipEvent());
  }
}
