FROM node:16-alpine AS dependency

WORKDIR /prowire

# Install node dependencies
COPY package*.json ./
COPY ./api/package*.json ./api/
COPY ./management/package*.json ./management/
RUN npm ci -w api
RUN npm ci -w management

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY ./management ./management
COPY ./api ./api

# Build from sources
FROM base AS build
ENV NODE_ENV production
RUN npm run -w api build
RUN npm run -w management build

# Host the built assets using nginx
FROM nginx:1.21.0-alpine as production

COPY --from=build /prowire/management/dist /usr/share/nginx/html
COPY ./management/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]