export interface VpvStartConfig {
  privateKey: string;
  publicKey: string;
  ca: string;
  certificate: string;
  mode: string;
  protocol: string;
  servers: Array<{port: number; ip: string}>;
}

export function buildOpenVpnConfig(config: VpvStartConfig) {
  const lines: Array<string> = [];
  lines.push('client');
  lines.push(`dev ${config.mode}`);
  lines.push(`proto ${config.protocol}`);
  lines.push(...config.servers.map((s) => `remote ${s.ip} ${s.port}`));
  lines.push('resolv-retry infinite');
  lines.push('nobind');
  lines.push('persist-key');
  lines.push('persist-tun');
  lines.push('remote-cert-tls server');
  lines.push('cipher AES-256-GCM');
  lines.push('<cert>', config.certificate.trim(), '</cert>');
  lines.push('<key>', config.privateKey.trim(), '</key>');
  lines.push('<ca>', config.ca.trim(), '</ca>');
  return lines.join('\n');
}
