import {generatePki} from '@prowire-vpn/pki';
import {dirSync, setGracefulCleanup} from 'tmp';

setGracefulCleanup();

const certsDir = dirSync({unsafeCleanup: true}).name;
generatePki({dir: certsDir, mock: true});

process.env.CA_CERTIFICATE = `${certsDir}/ca.crt`;
process.env.CA_PRIVATE_KEY = `${certsDir}/ca.key`;
