import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, UpdateQuery} from 'mongoose';
import {BaseSchema, Mapper} from 'app/infrastructure';
import {User, Identity, EmailAddress} from 'organization/domain';

@Schema()
class IdentitySchemaClass extends BaseSchema<Identity> {
  @Prop({type: String, required: true})
  public provider!: string;

  @Prop({type: String, required: true})
  public accessToken!: string;

  @Prop({type: String, required: true})
  public refreshToken!: string;
}

const IdentitySchema = SchemaFactory.createForClass(IdentitySchemaClass);

const identityMapper = new Mapper<Identity, IdentitySchemaClass>([
  {domainKey: 'id', storageKey: '_id', toDomain: (value) => value?.toString()},
  'provider',
  'accessToken',
  'refreshToken',
]);

@Schema()
export class UserSchemaClass extends BaseSchema<User> {
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
export type UserModel = Model<UserDocument> & {
  fromDomain: (user: User) => UpdateQuery<UserSchemaClass>;
  fromDomainChanges: (user: User) => UpdateQuery<UserSchemaClass>;
};
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

const mapper = new Mapper<User, UserSchemaClass>([
  {domainKey: 'id', storageKey: '_id', toDomain: (value) => value?.toString()},
  'name',
  {domainKey: 'email', storageKey: 'email', toDomain: (value) => new EmailAddress(value as string)},
  'avatar',
  'admin',
  {arrayMapper: identityMapper, domainKey: 'identities', storageKey: 'identities'},
]);

UserSchema.method('toDomain', function (): User {
  return new User(mapper.toDomain(this));
});

UserSchema.static('fromDomain', function (session: User): UpdateQuery<UserSchemaClass> {
  return mapper.fromDomain(session);
});

UserSchema.static('fromDomainChanges', function (session: User): UpdateQuery<UserSchemaClass> {
  return mapper.fromDomainChanges(session);
});
