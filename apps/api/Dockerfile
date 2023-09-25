# Instal package dependencies
FROM node:18 AS dependency

WORKDIR /prowire

# Install node dependencies
COPY ./package*.json ./
COPY ./pki/package*.json ./pki/
COPY ./api/package*.json ./api/

RUN npm ci --workspaces --include-workspace-root

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY . .

# Build from sources
FROM base AS build
RUN npx nx build @prowire-vpn/api

# Ship compiled sources. This allows us to remove unnecessary sources and dependencies
FROM node:18-alpine AS prod

WORKDIR /prowire

COPY --from=dependency /prowire/node_modules ./node_modules
COPY --from=build /prowire/api/dist ./api/dist
COPY ./package*.json ./
COPY ./pki/package*.json ./pki/
COPY ./api/package*.json ./api/
COPY ./api/static ./api/static

RUN npm prune -w api --production

CMD ["node", "--enable-source-maps", "./api/dist/main.js"]
