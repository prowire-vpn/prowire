import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from 'app/app.module';
import {AccessToken} from 'auth/domain';
import {type INestApplication} from '@nestjs/common';
import {build, createMany} from 'test';
import {User} from 'organization/domain';
import {FindUsersResponseBodyDto} from 'organization/presentation';

/**
 * Tests UserRepository class
 * @group integration
 */
describe('OrganizationModule', () => {
  let users: Array<User>;
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
    users = await createMany('user', 2);
    accessToken = build('accessToken', {admin: true});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET - /user', () => {
    it('should list all users', async () => {
      const response: {body: FindUsersResponseBodyDto} = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.users).toHaveLength(2);
      expect(response.body.users.map((user) => user.id).sort()).toEqual(
        users.map((user) => user.id).sort(),
      );
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
