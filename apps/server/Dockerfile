# Instal package dependencies
FROM node:18 AS dependency

WORKDIR /prowire

# Install node dependencies
COPY ./package*.json ./
COPY ./libs/pki/package*.json ./libs/pki/
COPY ./apps/api/package*.json ./apps/api/
COPY ./apps/server/package*.json ./apps/server/

RUN npm ci --workspaces --include-workspace-root

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY . .

# Build from sources
FROM base AS build
RUN npx nx build server

# Ship compiled sources. This allows us to remove unnecessary sources and dependencies
FROM node:18-alpine AS prod

WORKDIR /prowire

# Install OpenVPN and dependencies
RUN apk add --update openvpn iptables tcpdump

# Allow ipv4 forwarding
RUN echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.d/ipv4.conf
RUN sysctl -p /etc/sysctl.d/ipv4.conf

COPY --from=dependency /prowire/node_modules ./node_modules
COPY --from=build /prowire/apps/api/dist ./apps/api/dist
COPY --from=build /prowire/apps/server/dist ./apps/server/dist
COPY ./package*.json ./
COPY ./libs/pki/package*.json ./pki/
COPY ./apps/api/package*.json ./api/
COPY ./apps/server/package*.json ./server/
COPY ./apps/server/docker ./server/docker

RUN npm prune --production -w apps/server

ENTRYPOINT ["./server/docker/start.sh"]
