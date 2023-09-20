#!/usr/bin/env node

import {pki} from 'node-forge';

export const baseAttributes: Array<pki.CertificateField> = [
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

export const caAttributes: Array<pki.CertificateField> = [
  {
    name: 'commonName',
    value: 'root',
  },
  ...baseAttributes,
];

export const serverAttributes: Array<pki.CertificateField> = [
  {
    name: 'commonName',
    value: 'server',
  },
  ...baseAttributes,
];

export const clientAttributes: Array<pki.CertificateField> = [
  {
    name: 'commonName',
    value: 'client',
  },
  ...baseAttributes,
];
