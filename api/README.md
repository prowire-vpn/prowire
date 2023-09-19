# Prowire API

This is the main Prowire backend. It exposes a REST API for the different Prowire front-end clients to interact with, as well as a WebSocket interface for the Prowire VPN servers to connect to.

This backend is designed to have stateless instances, but it relies on [MongoDB](https://mongodb.com) for persisisting data, and also uses [Redis](https://redis.com) as a shared state.

## Developing

> All commands are to be executed from the monorepo root unless stated otherwise.

This is a [Node.JS](https://nodejs.org/en) project, built using [NestJS](https://nestjs.com/).

### Prerequisite

- Ensure that you have an appropriate version of Node.JS. the version requirement is set in the [.node-version](./.node-version) file.

### Environment

#### Dependencies

Install all software dependencies using

```bash
npm ci -w api
```

#### Required third parties

You need to have a MongoDB, as well as a Redis instance running and accessible to your machine. We recommend that you instanciate them using docker.

```bash
# This is a highly unsecure setup and should only ever be used for local development
# You can setup different user/password/database credentials
docker run -d --name mongo -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=root \
  -e MONGO_INITDB_DATABASE=prowire \
  mongo
docker run -d --name redis -p 6379:6379 redis
```

If they ever stop, you can easily launch them again using the following command.

```bash
  docker start redis mongo
```

Once you have the third party softwares running, you should setup the environment configuration.

- Copy the `api/.env.example` file to `api/.env`.
- Customise the `api/.env` file with the necessary data.

#### Running locally

To run locally use the following command

```bash
npm run start -w api
```

When developing it can be useful to have hot-reloading on file change.

```bash
npm run watch -w api
```

#### Executing tests

Tests are executed using [Jest](https://jestjs.io/). They can be executed using the following command

```bash
npm run test -w api
```
