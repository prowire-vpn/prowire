import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {RefreshToken} from 'auth/domain';
import {INestApplication} from '@nestjs/common';
import {build, create} from 'test';
import {User} from 'user/domain';

describe('AuthModule', () => {
  let user: User;
  let refreshToken: RefreshToken;

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
    refreshToken = build('refreshToken', {id: user.id});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST - /auth/refresh', () => {
    it('should refresh a token using request body', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({refreshToken: refreshToken.token})
        .expect(201);
    });

    it('should refresh a token using cookie', async () => {
      const authCookie = `prowire_auth=${JSON.stringify({refreshToken: refreshToken.token})}`;
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', [authCookie])
        .expect(201);
    });

    it('should send a 401 if no refresh token is provided', async () => {
      await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });

    it('should send a 401 if an invalid refresh token is provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({refreshToken: 'invalid'})
        .expect(401);
    });

    it('should send a 401 if the user does not exist', async () => {
      refreshToken = build('refreshToken');

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({refreshToken: refreshToken.token})
        .expect(401);
    });
  });
});
