import {OpenVpnConfigConstructor} from './openVpnConfig.entity';

export type UpdateOpenVpnOptions = Omit<OpenVpnConfigConstructor, 'port' | 'dhParam' | 'key'>;
