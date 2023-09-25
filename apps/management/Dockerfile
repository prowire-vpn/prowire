FROM node:18 AS dependency

WORKDIR /prowire

# Install node dependencies
COPY package*.json ./
COPY ./libs/pki/package*.json ./libs/pki/
COPY ./apps/api/package*.json ./apps/api/
COPY ./apps/management/package*.json ./apps/management/

RUN npm ci --workspaces --include-workspace-root

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY . .

# Build from sources
FROM base AS build
ENV NODE_ENV production
RUN npx nx build management

# Host the built assets using nginx
FROM nginx:1.25.2-alpine as production

COPY --from=build /prowire/apps/management/dist /usr/share/nginx/html
COPY ./apps/management/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./apps/management/docker/docker-entrypoint.d/* /docker-entrypoint.d

EXPOSE 80
