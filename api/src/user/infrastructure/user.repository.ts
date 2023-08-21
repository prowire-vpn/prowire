import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {UserModel, UserSchemaClass} from './user.schema';
import {User, UserId, EmailAddress} from 'user/domain';
import {UserMapper} from 'user/utils';
import {isObjectIdOrHexString} from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserSchemaClass.name) private userModel: UserModel,
    private userMapper: UserMapper,
  ) {}

  async persist(user: User): Promise<User> {
    await this.userModel.findOneAndUpdate({_id: user.id}, this.userMapper.toModelData(user), {
      new: true,
      upsert: true,
    });
    return user;
  }

  async delete(user: User): Promise<void> {
    const model = this.userMapper.toModel(user);
    await model.delete();
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    const user = await this.userModel.findOne({email: email.toString()}).exec();
    return user && this.userMapper.fromModel(user);
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user && this.userMapper.fromModel(user);
  }

  async getTotalCount(): Promise<number> {
    return await this.userModel.estimatedDocumentCount();
  }

  async find(search: string, limit: number, page: number): Promise<Array<User>> {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const findParams = search
      ? {
          $or: [
            {email: {$regex: safeSearch, $options: 'i'}},
            {name: {$regex: safeSearch, $options: 'i'}},
            {_id: isObjectIdOrHexString(search) ? search : null},
          ],
        }
      : {};
    const users = await this.userModel
      .find(findParams)
      .sort({name: 1, _id: 1})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return users.map((user) => this.userMapper.fromModel(user));
  }

  async getUserCount(): Promise<number> {
    return await this.userModel.estimatedDocumentCount();
  }
}
