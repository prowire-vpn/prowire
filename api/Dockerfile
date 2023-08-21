# Instal package dependencies
FROM node:16-alpine AS dependency

WORKDIR /prowire

# Install node dependencies
COPY ./package*.json ./
COPY ./api/package*.json ./api/
RUN npm ci -w api

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY ./api ./api

# Build from sources
FROM base AS build
RUN npm run -w api build

# Ship compiled sources. This allows us to remove unnecessary sources and dependencies
FROM dependency

COPY --from=build /prowire/api/dist ./api/dist
COPY ./api/static ./api/static

RUN npm prune -w api --production

CMD ["node", "--enable-source-maps", "./api/dist/main.js"]
