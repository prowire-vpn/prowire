# Prowire PKI (Public Key Infrastructure) generator

This is a simple tool that allows you to generate keys, certificates, and [Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) parameters easily to setup a development [Public Key Infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure) for Prowire.

> [!WARNING]
> This is intended to be used only in a development context and should **never** be used to generate production files.

## Usage

This tool will generate the following set of PEM encoded files:

- `ca.crt`: The X509 certificate of the CA (Certificate Authority), this is a self-signed certificate.
- `ca.key`: The RSA private they of the CA (Certificate Authority).
- `client.crt`: The X509 certificate of the client, signed by the CA.
- `client.key`: The RSA private key of the client.
- `dh.pem`: Diffie-Hellman parameters for server <-> client key exchange.
- `server.crt`: The X509 certificate of the server, signed by the CA.
- `server.key`: The RSA private key of the server.

### CLI

To generate the PKI files in `./my_pki_directory`.

`npx @prowire-vpn/pki ./my_pki_directory`

### JS library

To generate certificates from an JS project.

```javascript
import {generatePki} from '@prowire-vpn/pki';

generatePki({dir: './path/to/pki_dir'});
```

### Mocks

When speed is important, typically in a test environment, it is possible to symlink some mocks instead of generating new files.

CLI

`npx @prowire-vpn/pki --mock ./my_pki_directory`

JS library

```javascript
import {generatePki} from '@prowire-vpn/pki';

generatePki({dir: './path/to/pki_dir', mock: true});
```
