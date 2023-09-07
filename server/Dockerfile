# Instal package dependencies
FROM node:16-alpine AS dependency

WORKDIR /prowire

# Install OpenVPN and dependencies
RUN apk add --update openvpn iptables tcpdump

# Allow ipv4 forwarding
RUN echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.d/ipv4.conf
RUN sysctl -p /etc/sysctl.d/ipv4.conf

# Install node dependencies
COPY ./package*.json ./
COPY ./api/package*.json ./api/
COPY ./server/package*.json ./server/
RUN npm ci -w api
RUN npm ci -w server

# Copy sources. This step is used for automated testing
FROM dependency AS base
COPY ./api ./api
COPY ./server ./server

# Build from sources
FROM base AS build
RUN npm run -w api build
RUN npm run -w server build

# Ship compiled sources. This allows us to remove unnecessary sources and dependencies
FROM dependency

COPY --from=build /prowire/server/dist ./server/dist
COPY ./server/docker ./server/docker

RUN npm prune --production

ENTRYPOINT ["./server/docker/start.sh"]
