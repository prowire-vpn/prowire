import {linkSync, rmSync} from 'fs';
import {resolve} from 'path';

const files = [
  'ca.crt',
  'ca.key',
  'client.crt',
  'client.key',
  'server.crt',
  'server.key',
  'dh.pem',
];

/** Symlink mock files to the given directory */
export function generateMocks(dir: string) {
  for (const file of files) {
    const destPath = resolve(dir, file);
    const sourcePath = resolve(__dirname, '../mocks', file);
    rmSync(destPath, {force: true});
    linkSync(sourcePath, destPath);
  }
}
