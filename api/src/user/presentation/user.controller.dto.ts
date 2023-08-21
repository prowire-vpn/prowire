import {Transform} from 'class-transformer';
import {isEmail, IsString, IsInstance, IsOptional, IsInt, Min, Max} from 'class-validator';
import {User, EmailAddress} from 'user/domain';

export class UserDto {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  admin: boolean;

  constructor(user: User) {
    this.id = user.id.toString();
    this.name = user.name;
    this.avatar = user.avatar;
    this.email = user.email.toString();
    this.admin = user.admin;
  }
}

export class FindUsersRequestQueryDto {
  @IsOptional()
  @IsString()
  search = '';

  @IsOptional()
  @Transform(({value}) => parseInt(value, 10))
  @IsInt()
  @Min(10)
  @Max(50)
  limit = 20;

  @IsOptional()
  @Transform(({value}) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page = 1;
}

export class FindUsersResponseBodyDto {
  users: Array<UserDto>;

  constructor(users: Array<User>) {
    this.users = users.map((user) => new UserDto(user));
  }
}

export class CreateUserRequestBodyDto {
  @IsInstance(EmailAddress, {message: ({property}) => `${property} must be an email`})
  @Transform(({value}) => isEmail(value) && new EmailAddress(value))
  public email!: EmailAddress;

  @IsString()
  public name!: string;
}

export class CreateUserResponseBodyDto {
  user: UserDto;

  constructor(user: User) {
    this.user = new UserDto(user);
  }
}

export class GetUserByIdResponseBodyDto {
  user: UserDto;

  constructor(user: User) {
    this.user = new UserDto(user);
  }
}

export class UpdateUserRequestBodyDto {
  @IsOptional()
  @IsInstance(EmailAddress, {message: ({property}) => `${property} must be an email`})
  @Transform(({value}) => isEmail(value) && new EmailAddress(value))
  public email?: EmailAddress;

  @IsOptional()
  @IsString()
  public name?: string;
}

export class UpdateUserResponseBodyDto {
  user: UserDto;

  constructor(user: User) {
    this.user = new UserDto(user);
  }
}

export class DeleteUserResponseBodyDto {
  user = null;
}
