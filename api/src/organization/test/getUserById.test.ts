import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {AccessToken} from 'auth/domain';
import {INestApplication} from '@nestjs/common';
import {build, create} from 'test';
import {User} from 'organization/domain';
import {GetUserByIdResponseBodyDto} from 'organization/presentation';

describe('OrganizationModule', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
    it('should get myself', async () => {
      accessToken = build('accessToken', {admin: false, id: user.id});
      const response: {body: GetUserByIdResponseBodyDto} = await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.user.id).toEqual(user.id);
    });

    it('should get another user', async () => {
      const response: {body: GetUserByIdResponseBodyDto} = await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.user.id).toEqual(user.id);
    });

    it('should return 403 for non admins', async () => {
      accessToken = build('accessToken', {admin: false});

      await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
