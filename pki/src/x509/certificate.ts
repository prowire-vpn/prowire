import { pki, md } from "node-forge";

/** Options ot generate fake certificates */
interface generateCertsOptions {
  /** Indicates that we should generate a CA certificate */
  ca?: boolean;
  /** Certificate issuer information */
  issuer?: Array<pki.CertificateField>;
  /** Public key of the entity who's identity should be validated */
  identityKey: pki.PublicKey;
  /** Private key used to sign the certificate */
  signeeKey: pki.PrivateKey;
}

let serialNumber = 0;

export function generateCertificate(
  attributes: Array<pki.CertificateField>,
  options: generateCertsOptions
) {
  const cert = pki.createCertificate();
  cert.publicKey = options.identityKey;
  const serial = `00${serialNumber.toString()}`;
  cert.serialNumber = serial.substr(serial.length - 2);
  serialNumber++;
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  cert.setSubject(attributes);
  cert.setIssuer(options.issuer ?? attributes);
  cert.setExtensions(getExtensions(options));
  cert.sign(options.signeeKey, md.sha256.create());
  return pki.certificateToPem(cert);
}

/** Get the best fitting extensions for the certificate to generate */
function getExtensions(options: generateCertsOptions): Array<unknown> {
  return [
    {
      name: "basicConstraints",
      cA: options.ca === true,
    },
    {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true,
    },
    {
      name: "nsCertType",
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true,
    },
    {
      name: "subjectAltName",
      altNames: [
        {
          type: 2,
          value: "localhost",
        },
        {
          type: 7,
          ip: "127.0.0.1",
        },
      ],
    },
    {
      name: "subjectKeyIdentifier",
    },
  ];
}
