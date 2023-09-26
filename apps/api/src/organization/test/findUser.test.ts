import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {AccessToken} from 'auth/domain';
import {type INestApplication} from '@nestjs/common';
import {build, createMany} from 'test';
import {FindUsersResponseBodyDto} from 'organization/presentation';

/**
 * Tests UserRepository class
 * @group integration
 */
describe('OrganizationModule', () => {
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
    await createMany('user', 20);
    accessToken = build('accessToken', {admin: true});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET - /user', () => {
    it('should return a list of users with a page limit', async () => {
      const response: {body: FindUsersResponseBodyDto} = await request(app.getHttpServer())
        .get('/user')
        .query({limit: 10})
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.users).toHaveLength(10);
    });

    it('should return 403 for non admins', async () => {
      accessToken = build('accessToken', {admin: false});

      await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});
