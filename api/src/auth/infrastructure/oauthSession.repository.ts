import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {OAuthSessionModel, OAuthSessionClass} from './oauthSession.schema';
import {OAuthSession} from 'auth/domain/oauth/oauthSession.entity';

interface OAuthSessionFindParams {
  state?: string;
  code?: string;
}

@Injectable()
export class OAuthSessionRepository {
  constructor(@InjectModel(OAuthSessionClass.name) private sessionModel: OAuthSessionModel) {}

  async persist(session: OAuthSession): Promise<OAuthSession> {
    await this.sessionModel.updateOne(
      {_id: session.id},
      this.sessionModel.fromDomainChanges(session),
      {
        new: true,
        upsert: true,
      },
    );
    return session;
  }

  async find(params: OAuthSessionFindParams): Promise<OAuthSession | null> {
    if (!params.state && !params.code) throw new Error('No search params provided');
    const session = await this.sessionModel.findOne(params);
    return session && session.toDomain();
  }
}
