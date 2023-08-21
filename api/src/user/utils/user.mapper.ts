import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, EmailAddress} from 'user/domain';
import {UserDocument, UserModel, UserSchemaClass} from 'user/infrastructure/user.schema';
import {IdentityProvider} from 'user/domain/identity.entity';

@Injectable()
export class UserMapper {
  constructor(@InjectModel(UserSchemaClass.name) private userModel: UserModel) {}

  public fromModel(model: UserDocument): User {
    return new User({
      id: model._id.toString(),
      name: model.name,
      email: new EmailAddress(model.email),
      admin: model.admin,
      identities: model.identities.map((identity) => ({
        provider: identity.provider as IdentityProvider,
        accessToken: identity.accessToken,
        refreshToken: identity.refreshToken,
      })),
    });
  }

  public toModel(user: User): UserDocument {
    return new this.userModel(UserMapper.toModelData(user));
  }

  public toModelData(user: User) {
    return UserMapper.toModelData(user);
  }

  public static toModelData(user: User) {
    return {
      _id: user.id,
      name: user.name,
      email: user.email.toString(),
      admin: user.admin,
      identities: user.identities.map((identity) => ({
        provider: identity.provider,
        accessToken: identity.accessToken,
        refreshToken: identity.refreshToken,
      })),
    };
  }
}
