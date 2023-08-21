import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserRepository, UserSchemaClass, UserSchema} from './infrastructure';
import {UserService, AuthListener} from './domain';
import {UserController} from './presentation';
import {UserMapper} from './utils';

@Module({
  imports: [MongooseModule.forFeature([{name: UserSchemaClass.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserMapper, AuthListener],
  exports: [UserService],
})
export class UserModule {}
