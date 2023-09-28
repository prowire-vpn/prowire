import {Injectable} from '@nestjs/common';
import {User, type UserUpdater} from './user.entity';
import {UserRepository} from 'organization/infrastructure/user.repository';
import {EmailAlreadyRegisteredError, UserNotFoundError} from './user.service.error';
import {EmailAddress} from './email.entity';
import {type RegisterUserInfo} from './user.service.interface';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(userInfo: RegisterUserInfo): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userInfo.email);
    if (existingUser) throw new EmailAlreadyRegisteredError(userInfo.email);
    const newUser = new User(userInfo);
    await this.userRepository.persist(newUser);
    return newUser;
  }

  async get(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getByEmail(email: EmailAddress): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, updates: UserUpdater): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    user.update(updates);
    await this.userRepository.persist(user);
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    this.userRepository.delete(user);
  }

  async find(search: string, limit: number, page: number): Promise<Array<User>> {
    return await this.userRepository.find(search, limit, page);
  }

  async getUserCount(): Promise<number> {
    return await this.userRepository.getUserCount();
  }
}
