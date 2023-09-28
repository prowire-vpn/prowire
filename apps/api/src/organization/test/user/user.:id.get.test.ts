import request from 'supertest';
import {AccessToken} from 'auth/domain';
import {build, create, createApp, type CreateAppResult} from 'test';
import {User} from 'organization/domain';
import {GetUserByIdResponseBodyDto} from 'organization/presentation';

/**
 * @group integration
 */
describe('GET - /user/:id', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: CreateAppResult;

  beforeAll(async () => {
    app = await createApp();
  });

  beforeEach(async () => {
    user = await create('user');
    accessToken = build('accessToken', {admin: true});
  });

  it('should get myself', async () => {
    accessToken = build('accessToken', {admin: false, id: user.id});
    const response: {body: GetUserByIdResponseBodyDto} = await request(app.httpServer)
      .get('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.user.id).toEqual(user.id);
  });

  it('should get another user', async () => {
    const response: {body: GetUserByIdResponseBodyDto} = await request(app.httpServer)
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.user.id).toEqual(user.id);
  });

  it('should return 403 for non admins', async () => {
    accessToken = build('accessToken', {admin: false});

    await request(app.httpServer)
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
