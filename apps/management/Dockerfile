FROM node:18 AS dependency

WORKDIR /prowire

# Install node dependencies
COPY package*.json ./
COPY ./pki/package*.json ./pki/
COPY ./api/package*.json ./api/
COPY ./management/package*.json ./management/

RUN npm ci --workspaces --include-workspace-root

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY . .

# Build from sources
FROM base AS build
ENV NODE_ENV production
RUN npx nx build @prowire-vpn/management

# Host the built assets using nginx
FROM nginx:1.25.2-alpine as production

COPY --from=build /prowire/management/dist /usr/share/nginx/html
COPY ./management/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./management/docker/docker-entrypoint.d/* /docker-entrypoint.d

EXPOSE 80
