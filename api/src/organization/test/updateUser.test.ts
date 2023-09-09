import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {AccessToken} from 'auth/domain';
import {INestApplication} from '@nestjs/common';
import {build, create} from 'test';
import {User} from 'organization/domain';
import {UpdateUserResponseBodyDto} from 'organization/presentation';
import {faker} from '@faker-js/faker';
import {UserModel, UserSchemaClass} from 'organization/infrastructure';
import {getModelToken} from '@nestjs/mongoose';

describe('OrganizationModule', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: INestApplication;
  let module: TestingModule;
  let userModel: UserModel;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userModel = module.get<UserModel>(getModelToken(UserSchemaClass.name));

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    user = await create('user');
    accessToken = build('accessToken', {admin: true});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET - /user/:id', () => {
    it('should update a user', async () => {
      const name = faker.name.fullName();
      const response: {body: UpdateUserResponseBodyDto} = await request(app.getHttpServer())
        .patch(`/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({name})
        .expect(200);

      const result = await userModel.findById(user.id).exec();

      expect(response.body.user.name).toEqual(name);
      expect(result?.name).toEqual(name);
    });

    it('should return 403 for non admins', async () => {
      accessToken = build('accessToken', {admin: false});

      await request(app.getHttpServer())
        .patch(`/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
