import {Injectable} from '@nestjs/common';
import {readFileSync} from 'fs';
import {ConfigService} from '@nestjs/config';
import {randomBytes} from 'crypto';
import {pki, md} from 'node-forge';
import {type GenerateCertOptions} from './pki.service.interface';

@Injectable()
export class PkiService {
  certificate: string;
  privateKey: string;

  public constructor(private readonly configService: ConfigService) {
    this.certificate = readFileSync(
      this.configService.getOrThrow<string>('CA_CERTIFICATE'),
      'utf-8',
    );
    this.privateKey = readFileSync(
      this.configService.getOrThrow<string>('CA_PRIVATE_KEY'),
      'utf-8',
    );
  }

  /**
   * Sign a certificate for a server/client
   * Returns the PEM encoded certificate signed by the CA
   */
  public generateCertificate(publicKey: string, commonName: string, options?: GenerateCertOptions) {
    const clientPublicKey = pki.publicKeyFromPem(publicKey);
    const caPrivateKey = pki.privateKeyFromPem(this.privateKey);
    const caCertificate = pki.certificateFromPem(this.certificate);
    const clientCertificate = pki.createCertificate();

    clientCertificate.publicKey = clientPublicKey;
    // The serial number should be unique per CA. 15 bytes of randomness should be enough for us as each individual cluster is its own CA
    // It has to be represented as a 20 byte string, hence the 15 bytes encoded as base64
    clientCertificate.serialNumber = `${parseInt(randomBytes(8).toString('hex'), 16)}`;

    clientCertificate.validity.notBefore = new Date();
    clientCertificate.validity.notAfter = new Date();
    clientCertificate.validity.notAfter.setFullYear(
      clientCertificate.validity.notBefore.getFullYear() + 1,
    );

    clientCertificate.setSubject(this.getAttributes(commonName));
    clientCertificate.setIssuer(caCertificate.subject.attributes);
    clientCertificate.setExtensions(this.getExtensions(options?.server));

    clientCertificate.sign(caPrivateKey, md.sha256.create());
    return {certificate: pki.certificateToPem(clientCertificate), ca: this.certificate};
  }

  /** Get the certificate attributes */
  private getAttributes(commonName: string): Array<pki.CertificateField> {
    return [
      {
        name: 'commonName',
        value: commonName,
      },
      {
        name: 'countryName',
        value: 'FR',
      },
      {
        shortName: 'ST',
        value: 'Paris',
      },
      {
        name: 'localityName',
        value: 'Paris',
      },
      {
        name: 'organizationName',
        value: 'Prowire',
      },
      {
        shortName: 'OU',
        value: 'Prowire Certificate Authority',
      },
    ];
  }

  /** Get the certificate extensions to apply */
  private getExtensions(server = false): Array<unknown> {
    return [
      {
        name: 'basicConstraints',
        cA: false,
      },
      {
        name: 'keyUsage',
        keyCertSign: false,
        digitalSignature: true,
        nonRepudiation: false,
        keyEncipherment: true,
        keyAgreement: true,
        dataEncipherment: false,
      },
      {
        name: 'extKeyUsage',
        serverAuth: server,
        clientAuth: !server,
        codeSigning: false,
        emailProtection: false,
        timeStamping: false,
      },
      {
        name: 'nsCertType',
        client: !server,
        server: server,
        email: false,
        objsign: false,
        sslCA: false,
        emailCA: false,
        objCA: false,
      },
      {
        name: 'subjectAltName',
        altNames: [],
      },
      {
        name: 'subjectKeyIdentifier',
      },
    ];
  }

  /** Get the PEM encoded CA certificate */
  public getCA(): string {
    return this.certificate;
  }
}
