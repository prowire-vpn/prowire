import request from 'supertest';
import {AccessToken} from 'auth/domain';
import {build, createApp, type CreateAppResult} from 'test';
import {User} from 'organization/domain';
import {CreateUserResponseBodyDto} from 'organization/presentation';
import {type UserModel, UserSchemaClass} from 'organization/infrastructure';
import {getModelToken} from '@nestjs/mongoose';

/**
 * @group integration
 */
describe('POST - /user', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: CreateAppResult;
  let userModel: UserModel;

  beforeEach(async () => {
    user = await build('user');
    accessToken = build('accessToken', {admin: true});
  });

  beforeAll(async () => {
    app = await createApp();
    userModel = app.module.get<UserModel>(getModelToken(UserSchemaClass.name));
  });

  it('should return create a user on success', async () => {
    const response: {body: CreateUserResponseBodyDto} = await request(app.httpServer)
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({email: user.email.toString(), name: user.name})
      .expect(201);

    const result = await userModel.findById(response.body.user.id).exec();
    expect(result).not.toBeNull();
    expect(result?.email).toEqual(user.email.toString());
    expect(result?.name).toEqual(user.name);
  });

  it('should return 400 if the payload is not valid', async () => {
    await request(app.httpServer)
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({email: 123})
      .expect(400);
  });

  it('should return 403 for non admins', async () => {
    accessToken = build('accessToken', {admin: false});

    await request(app.httpServer)
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({email: user.email.toString(), name: user.name})
      .expect(403);
  });
});
