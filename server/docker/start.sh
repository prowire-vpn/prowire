#!/bin/sh

# Start script in the Docker container

# Create TUN interface if it does not exist
echo "Creating TUN interface..."
mkdir -p /dev/net
if [ ! -c /dev/net/tun ]; then
  mknod /dev/net/tun c 10 200
fi
echo "TUN interface created"

# Allow correct routing iptable rules
echo "Applying iptable rules..."
iptables -t nat -C POSTROUTING -o eth0 -j MASQUERADE 2>/dev/null || {
  iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
}
echo "iptable rules applied"

# Start server
node --enable-source-maps ./server/dist/main.js