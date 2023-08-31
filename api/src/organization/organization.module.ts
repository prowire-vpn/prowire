import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserRepository, UserSchemaClass, UserSchema} from './infrastructure';
import {UserService, AuthListener} from './domain';
import {UserController} from './presentation';

@Module({
  imports: [MongooseModule.forFeature([{name: UserSchemaClass.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthListener],
  exports: [UserService],
})
export class OrganizationModule {}
