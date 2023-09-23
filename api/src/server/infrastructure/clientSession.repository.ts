import {Injectable} from '@nestjs/common';
import {type VpnClientSessionModel, VpnClientSessionSchemaClass} from './clientSession.schema';
import {InjectModel} from '@nestjs/mongoose';
import {VpnClientSession} from 'server/domain/clientSession.entity';

@Injectable()
export class VpnClientSessionRepository {
  constructor(
    @InjectModel(VpnClientSessionSchemaClass.name) private sessionModel: VpnClientSessionModel,
  ) {}

  async persist(session: VpnClientSession): Promise<VpnClientSession> {
    await this.sessionModel.findOneAndUpdate(
      {_id: session.id},
      this.sessionModel.fromDomainChanges(session),
      {
        new: true,
        upsert: true,
      },
    );
    return session;
  }

  async get(id: string): Promise<VpnClientSession | null> {
    const session = await this.sessionModel.findOne({_id: id});
    if (!session) return null;
    return session.toDomain();
  }

  async findByUserId(
    userId: string,
    {limit, page}: {limit: number; page: number},
  ): Promise<{sessions: VpnClientSession[]; total: number}> {
    if (page < 0) throw new Error('page must be greater than or equal to 0');
    if (limit < 1) throw new Error('limit must be greater than or equal to 1');
    const [sessions, total] = await Promise.all([
      this.sessionModel
        .find({userId})
        .sort({createdAt: -1})
        .limit(limit)
        .skip(page * limit)
        .exec(),
      this.sessionModel.countDocuments({userId}).exec(),
    ]);
    return {sessions: sessions.map((session) => session.toDomain()), total};
  }
}
