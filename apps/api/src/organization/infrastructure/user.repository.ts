import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {type UserModel, UserSchemaClass} from './user.schema';
import {User} from 'organization/domain/user.entity';
import {EmailAddress} from 'organization/domain/email.entity';
import {isObjectIdOrHexString} from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserSchemaClass.name) private userModel: UserModel) {}

  async persist(user: User): Promise<User> {
    await this.userModel.updateOne({_id: user.id}, this.userModel.fromDomainChanges(user), {
      new: true,
      upsert: true,
    });
    return user;
  }

  async delete(user: User): Promise<void> {
    const model = new this.userModel(this.userModel.fromDomain(user));
    await model.delete();
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    const user = await this.userModel.findOne({email: email.toString()}).exec();
    return user && user.toDomain();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user && user.toDomain();
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
    return users.map((user) => user.toDomain());
  }

  async getUserCount(): Promise<number> {
    return await this.userModel.estimatedDocumentCount();
  }
}
