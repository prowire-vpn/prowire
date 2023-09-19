import {Injectable} from '@nestjs/common';
import {VpnClientSessionModel, VpnClientSessionSchemaClass} from './clientSession.schema';
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
}
