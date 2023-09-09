import {NotImplementedException} from '@nestjs/common';
import {Client, ClientConstructor} from 'auth/domain';
import {ObjectId} from 'bson';

export const clientFactory = {
  build(overrides?: Partial<ClientConstructor>): Client {
    return new Client({
      id: new ObjectId().toHexString(),
      admin: false,
      ...overrides,
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async persist(client: Client, Model: unknown): Promise<Client> {
    throw new NotImplementedException();
  },
};
