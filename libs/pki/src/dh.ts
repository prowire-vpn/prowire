import {exec} from 'child_process';

const DH_PARAMS_REGEX = /-----BEGIN DH PARAMETERS-----\n(?:.|\n)*-----END DH PARAMETERS-----/;

/** As this is to be an expensive operation and that we only use this in tests, we return a pre-computed one */
export async function generateDiffieHellmanParameters() {
  return new Promise<string>((resolve, reject) =>
    exec('openssl dhparam 1024', (error, stdout) => {
      if (error) return reject(error);
      const match = DH_PARAMS_REGEX.exec(stdout);
      if (!match) return reject(new Error('Could not find DH params in output:\n' + stdout));
      resolve(match[0]);
    }),
  );
}
