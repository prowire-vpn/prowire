# Instal package dependencies
FROM node:18 AS dependency

WORKDIR /prowire

# Install node dependencies
COPY ./package*.json ./
COPY ./libs/pki/package*.json ./libs/pki/
COPY ./apps/api/package*.json ./apps/api/

RUN npm ci --workspaces --include-workspace-root

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY . .

# Build from sources
FROM base AS build
RUN npx nx build api

# Ship compiled sources. This allows us to remove unnecessary sources and dependencies
FROM node:18-alpine AS prod

WORKDIR /prowire

COPY --from=dependency /prowire/node_modules ./node_modules
COPY --from=build /prowire/apps/api/dist ./api/dist
COPY ./package*.json ./
COPY ./libs/pki/package*.json ./libs/pki/
COPY ./apps/api/package*.json ./apps/api/
COPY ./apps/api/static ./apps/api/static

RUN npm prune -w apps/api --production

CMD ["node", "--enable-source-maps", "./api/dist/main.js"]
