import request from 'supertest';
import {AccessToken} from 'auth/domain';
import {build, create, createApp, type CreateAppResult} from 'test';
import {User} from 'organization/domain';
import {UpdateUserResponseBodyDto} from 'organization/presentation';
import {faker} from '@faker-js/faker';
import {type UserModel, UserSchemaClass} from 'organization/infrastructure';
import {getModelToken} from '@nestjs/mongoose';

/**
 * @group integration
 */
describe('GET - /user/:id', () => {
  let user: User;
  let accessToken: AccessToken;

  let app: CreateAppResult;
  let userModel: UserModel;

  beforeAll(async () => {
    app = await createApp();
    userModel = app.module.get<UserModel>(getModelToken(UserSchemaClass.name));
  });

  beforeEach(async () => {
    user = await create('user');
    accessToken = build('accessToken', {admin: true});
  });

  it('should update a user', async () => {
    const name = faker.name.fullName();
    const response: {body: UpdateUserResponseBodyDto} = await request(app.httpServer)
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

    await request(app.httpServer)
      .patch(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
