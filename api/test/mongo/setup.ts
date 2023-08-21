import {getReadyConnection} from 'test/utils';

process.env.MONGO_CONNECTION_STRING = __MONGO_URI__;
process.env.MONGO_DATABASE = __MONGO_DB_NAME__;

afterEach(async () => {
  const connection = getReadyConnection();
  if (connection) {
    const collections = Object.values(connection.collections);
    await Promise.all(collections.map((collection) => collection.deleteMany({})));
  }
});
export {};
