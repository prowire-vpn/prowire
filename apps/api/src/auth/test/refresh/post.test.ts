import request from 'supertest';
import {RefreshToken} from 'auth/domain';
import {build, create, createApp, type CreateAppResult} from 'test';
import {User} from 'organization/domain';

/**
 * @group integration
 */
describe('POST - /auth/refresh', () => {
  let user: User;
  let refreshToken: RefreshToken;

  let app: CreateAppResult;

  beforeAll(async () => {
    app = await createApp();
  });

  beforeEach(async () => {
    user = await create('user');
    refreshToken = build('refreshToken', {id: user.id});
  });

  it('should refresh a token using request body', async () => {
    await request(app.httpServer)
      .post('/auth/refresh')
      .send({refresh_token: refreshToken.token})
      .expect(201);
  });

  it('should refresh a token using cookie', async () => {
    const authCookie = `prowire_auth=${JSON.stringify({refreshToken: refreshToken.token})}`;
    await request(app.httpServer).post('/auth/refresh').set('Cookie', [authCookie]).expect(201);
  });

  it('should send a 401 if no refresh token is provided', async () => {
    await request(app.httpServer).post('/auth/refresh').expect(401);
  });

  it('should send a 401 if an invalid refresh token is provided', async () => {
    await request(app.httpServer).post('/auth/refresh').send({refreshToken: 'invalid'}).expect(401);
  });

  it('should send a 401 if the user does not exist', async () => {
    refreshToken = build('refreshToken');

    await request(app.httpServer)
      .post('/auth/refresh')
      .send({refreshToken: refreshToken.token})
      .expect(401);
  });
});
