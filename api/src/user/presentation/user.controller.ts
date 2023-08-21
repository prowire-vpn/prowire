import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  NotFoundException,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseFilters,
  ForbiddenException,
} from '@nestjs/common';
import {UserService} from 'user/domain';
import {AccessTokenGuard, ClientRolesGuard, Client as IClient} from 'auth/domain';
import {Client, Admin} from 'auth/utils';
import {
  FindUsersRequestQueryDto,
  FindUsersResponseBodyDto,
  CreateUserRequestBodyDto,
  CreateUserResponseBodyDto,
  GetUserByIdResponseBodyDto,
  UpdateUserRequestBodyDto,
  UpdateUserResponseBodyDto,
  DeleteUserResponseBodyDto,
} from './user.controller.dto';
import {
  CreateUserExceptionFilter,
  UpdateUserExceptionFilter,
  DeleteUserExceptionFilter,
} from './user.exception';

@Controller('user')
@UseGuards(AccessTokenGuard, ClientRolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Admin()
  async find(@Query() query: FindUsersRequestQueryDto): Promise<FindUsersResponseBodyDto> {
    const {search, limit, page} = query;
    const users = await this.userService.find(search, limit, page);
    return new FindUsersResponseBodyDto(users);
  }

  @Post()
  @Admin()
  @UseFilters(CreateUserExceptionFilter)
  async createUser(@Body() body: CreateUserRequestBodyDto): Promise<CreateUserResponseBodyDto> {
    const {email, name} = body;
    const user = await this.userService.register({
      name,
      email,
      identities: [],
    });
    return new CreateUserResponseBodyDto(user);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @Client() client: IClient,
  ): Promise<GetUserByIdResponseBodyDto> {
    const {id: myId, admin} = client;

    // When using "me" id we use the current user ID
    if (id === 'me') {
      id = myId;
    } else if (!admin) {
      throw new ForbiddenException(undefined, 'Only admin users can access other users data');
    }

    const user = await this.userService.get(id);
    if (!user) throw new NotFoundException(undefined, `User "${id}" does not exist`);

    return new GetUserByIdResponseBodyDto(user);
  }

  @Patch(':id')
  @Admin()
  @UseFilters(UpdateUserExceptionFilter)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequestBodyDto,
  ): Promise<UpdateUserResponseBodyDto> {
    const user = await this.userService.update(id, body);
    return new UpdateUserResponseBodyDto(user);
  }

  @Delete(':id')
  @Admin()
  @UseFilters(DeleteUserExceptionFilter)
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponseBodyDto> {
    await this.userService.delete(id);
    return new DeleteUserResponseBodyDto();
  }
}
