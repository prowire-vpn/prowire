import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, UpdateQuery} from 'mongoose';
import {OAuthSession} from 'auth/domain';

@Schema()
export class OAuthSessionClass {
  @Prop({type: String, required: false})
  userId!: Date;

  @Prop({type: Date, required: true})
  started_at!: Date;

  @Prop({type: String, required: true, unique: true, index: true})
  state!: string;

  @Prop({type: String, required: true})
  code_challenge!: string;

  @Prop({type: String, required: true})
  redirect_uri!: string;

  @Prop({type: String, required: false, unique: true, index: true, sparse: true})
  code?: string;

  @Prop({type: Date, required: false})
  code_issued_at?: Date;

  @Prop({type: Boolean, required: false})
  code_used?: boolean;

  toDomain!: () => OAuthSession;
}

export type OAuthSessionDocument = HydratedDocument<OAuthSessionClass>;
export type OAuthSessionModel = Model<OAuthSessionDocument> & {
  fromDomain: (server: OAuthSession) => UpdateQuery<OAuthSession>;
};
export const OAuthSessionSchema = SchemaFactory.createForClass(OAuthSessionClass);

OAuthSessionSchema.methods.toDomain = function (): OAuthSession {
  return new OAuthSession({
    userId: this.userId,
    started_at: this.started_at,
    state: this.state,
    code_challenge: this.code_challenge,
    redirect_uri: this.redirect_uri,
    code: this.code,
    code_issued_at: this.code_issued_at,
    code_used: this.code_used,
  });
};

OAuthSessionSchema.statics.fromDomain = function (
  session: OAuthSession,
): UpdateQuery<OAuthSession> {
  return {
    userId: session.userId,
    started_at: session.started_at,
    state: session.state,
    code_challenge: session.code_challenge,
    redirect_uri: session.redirect_uri,
    code: session.code,
    code_issued_at: session.code_issued_at,
    code_used: session.code_used,
  };
};
