import request from 'supertest';

import {AccessToken} from 'auth/domain';
import {build, create, createApp, type CreateAppResult} from 'test';
import {User} from 'organization/domain';
import {type UserModel, UserSchemaClass} from 'organization/infrastructure';
import {getModelToken} from '@nestjs/mongoose';

/**
 * @group integration
 */
describe('DELETE - /user/:id', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: CreateAppResult;

  let userModel: UserModel;

  beforeEach(async () => {
    user = await create('user');
    accessToken = build('accessToken', {admin: true});
  });

  beforeAll(async () => {
    app = await createApp();
    userModel = app.module.get<UserModel>(getModelToken(UserSchemaClass.name));
  });

  it('should delete a user', async () => {
    await request(app.httpServer)
      .delete(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const result = await userModel.findById(user.id).exec();

    expect(result).toBeNull();
  });

  it('should return 403 for non admins', async () => {
    accessToken = build('accessToken', {admin: false});

    await request(app.httpServer)
      .delete(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
