import {exec} from 'child_process';

async function run(): Promise<void> {
  return new Promise((resolve, reject) => {
    exec('envsubst < ./public/config.json.tmpl > ./public/config.json', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
