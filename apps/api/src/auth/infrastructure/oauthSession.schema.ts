import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {type HydratedDocument, Model, type UpdateQuery} from 'mongoose';
import {OAuthSession} from 'auth/domain/oauth/oauthSession.entity';
import {BaseSchema, Mapper} from 'app/infrastructure';

@Schema()
export class OAuthSessionClass extends BaseSchema<OAuthSession> {
  @Prop({type: String, required: false})
  public userId!: Date;

  @Prop({type: Date, required: true})
  public started_at!: Date;

  @Prop({type: String, required: true, unique: true, index: true})
  public state!: string;

  @Prop({type: String, required: true})
  public code_challenge!: string;

  @Prop({type: String, required: true})
  public redirect_uri!: string;

  @Prop({type: String, required: false, unique: true, index: true, sparse: true})
  public code?: string;

  @Prop({type: Date, required: false})
  public code_issued_at?: Date;

  @Prop({type: Boolean, required: false})
  public code_used?: boolean;

  @Prop({type: String, required: true})
  public provider!: string;
}

export type OAuthSessionDocument = HydratedDocument<OAuthSessionClass>;
export type OAuthSessionModel = Model<OAuthSessionDocument> & {
  fromDomain: (session: OAuthSession) => UpdateQuery<OAuthSessionClass>;
  fromDomainChanges: (session: OAuthSession) => UpdateQuery<OAuthSessionClass>;
};
export const OAuthSessionSchema = SchemaFactory.createForClass(OAuthSessionClass);

const mapper = new Mapper<OAuthSession, OAuthSessionClass>([
  {domainKey: 'id', storageKey: '_id', toDomain: (value) => value?.toString()},
  'userId',
  'started_at',
  'state',
  'code_challenge',
  'redirect_uri',
  'code',
  'code_issued_at',
  'code_used',
  'provider',
]);

OAuthSessionSchema.method('toDomain', function (): OAuthSession {
  return new OAuthSession(mapper.toDomain(this));
});

OAuthSessionSchema.static(
  'fromDomain',
  function (session: OAuthSession): UpdateQuery<OAuthSession> {
    return mapper.fromDomain(session);
  },
);

OAuthSessionSchema.static(
  'fromDomainChanges',
  function (session: OAuthSession): UpdateQuery<OAuthSession> {
    return mapper.fromDomainChanges(session);
  },
);
