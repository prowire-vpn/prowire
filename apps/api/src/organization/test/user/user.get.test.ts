import request from 'supertest';
import {AccessToken} from 'auth/domain';
import {build, createMany, createApp, type CreateAppResult} from 'test';
import {FindUsersResponseBodyDto} from 'organization/presentation';

/**
 * @group integration
 */
describe('GET - /user', () => {
  let accessToken: AccessToken;

  let app: CreateAppResult;

  beforeAll(async () => {
    app = await createApp();
  });

  beforeEach(async () => {
    await createMany('user', 20);
    accessToken = build('accessToken', {admin: true});
  });

  it('should return a list of users with a page limit', async () => {
    const response: {body: FindUsersResponseBodyDto} = await request(app.httpServer)
      .get('/user')
      .query({limit: 10})
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.users).toHaveLength(10);
  });

  it('should return 403 for non admins', async () => {
    accessToken = build('accessToken', {admin: false});

    await request(app.httpServer)
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
