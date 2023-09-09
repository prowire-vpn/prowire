import {OpenVpnConfigConstructor} from './open_vpn_config.entity';

export type UpdateOpenVpnOptions = Omit<OpenVpnConfigConstructor, 'port' | 'dhParam' | 'key'>;
