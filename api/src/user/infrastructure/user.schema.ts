import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';

@Schema()
class IdentitySchemaClass {
  @Prop({type: String, required: true})
  public provider!: string;

  @Prop({type: String, required: true})
  public accessToken!: string;

  @Prop({type: String, required: true})
  public refreshToken!: string;
}

const IdentitySchema = SchemaFactory.createForClass(IdentitySchemaClass);

@Schema()
export class UserSchemaClass {
  @Prop({type: String, required: true})
  public name!: string;

  @Prop({type: String, required: true, unique: true, index: true})
  public email!: string;

  @Prop({type: String, required: false})
  public avatar?: string;

  @Prop({type: Boolean, required: true, default: false})
  public admin!: boolean;

  @Prop({type: [IdentitySchema]})
  identities!: Array<IdentitySchemaClass>;
}

export type UserDocument = HydratedDocument<UserSchemaClass>;
export type UserModel = Model<UserDocument>;
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
