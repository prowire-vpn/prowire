#!/usr/bin/env node

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {generatePki} from './index';

async function parseArgs() {
  const argv = await yargs(hideBin(process.argv))
    .usage('Usage: $0 [options] <dir>')
    .example('$0 ./certs', 'generate PKI files in ./certs')
    .command('$0 <dir>', 'generate PKI files in <dir>', (yargs) => {
      yargs.positional('dir', {
        describe: 'Directory in which the files should be stored',
        demandOption: true,
        type: 'string',
      });
    })
    .positional('dir', {
      describe: 'Directory in which the files should be stored',
      demandOption: true,
      type: 'string',
    })
    .option('mock', {
      describe: 'Generate mock files for testing (fast)',
      type: 'boolean',
      default: false,
    })
    .help('h')
    .alias('h', 'help').argv;
  return argv;
}

async function run() {
  const args = await parseArgs();
  console.log('Generating PKI files...');
  const dir = await generatePki(args);
  console.log(`PKI files generated in ${dir}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
