import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {AccessToken} from 'auth/domain';
import {INestApplication} from '@nestjs/common';
import {build, create} from 'test';
import {User} from 'organization/domain';
import {UserModel, UserSchemaClass} from 'organization/infrastructure';
import {getModelToken} from '@nestjs/mongoose';

/**
 * Tests UserRepository class
 * @group integration
 */
describe('OrganizationModule', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: INestApplication;
  let module: TestingModule;
  let userModel: UserModel;

  beforeEach(async () => {
    user = await create('user');
    accessToken = build('accessToken', {admin: true});
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userModel = module.get<UserModel>(getModelToken(UserSchemaClass.name));

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DELETE - /user/:id', () => {
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const result = await userModel.findById(user.id).exec();

      expect(result).toBeNull();
    });

    it('should return 403 for non admins', async () => {
      accessToken = build('accessToken', {admin: false});

      await request(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
