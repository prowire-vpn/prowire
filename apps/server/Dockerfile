# Instal package dependencies
FROM node:18 AS dependency

WORKDIR /prowire

# Install node dependencies
COPY ./package*.json ./
COPY ./pki/package*.json ./pki/
COPY ./api/package*.json ./api/
COPY ./server/package*.json ./server/

RUN npm ci --workspaces --include-workspace-root

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY . .

# Build from sources
FROM base AS build
RUN npx nx build @prowire-vpn/server

# Ship compiled sources. This allows us to remove unnecessary sources and dependencies
FROM node:18-alpine AS prod

WORKDIR /prowire

# Install OpenVPN and dependencies
RUN apk add --update openvpn iptables tcpdump

# Allow ipv4 forwarding
RUN echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.d/ipv4.conf
RUN sysctl -p /etc/sysctl.d/ipv4.conf

COPY --from=dependency /prowire/node_modules ./node_modules
COPY --from=build /prowire/api/dist ./api/dist
COPY --from=build /prowire/server/dist ./server/dist
COPY ./package*.json ./
COPY ./pki/package*.json ./pki/
COPY ./api/package*.json ./api/
COPY ./server/package*.json ./server/
COPY ./server/docker ./server/docker

RUN npm prune --production

ENTRYPOINT ["./server/docker/start.sh"]
