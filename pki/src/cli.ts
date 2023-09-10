import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generatePki } from "./index";

async function parseArgs() {
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 [options]")
    .example("$0 --dir ./certs", "generate certificates in ./certs")
    .options({
      d: {
        type: "string",
        alias: "dir",
        demandOption: true,
        nargs: 1,
        describe: "Directory to which store the files",
      },
    })
    .help("h")
    .alias("h", "help").argv;
  return { dir: argv.d };
}

async function run() {
  const args = await parseArgs();
  console.log("Generating certificates...");
  const dir = await generatePki(args);
  console.log(`Certificates generated in ${dir}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
