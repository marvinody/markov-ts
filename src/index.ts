const fs = require('fs').promises;
import { once } from 'events';
import * as yargs from 'yargs';
import { Markov } from './markov';
const readline = require('readline');


let args = yargs.command(
  'create <FILE> [OUT]',
  'create a markov state from a corpus file and save the state in out',
  yargs => {
    return yargs.positional('FILE', {
      description: 'File (newline-separated) to build the state from',
      type: 'string',
    }).positional('OUT', {
      describe: 'File where the state will be saved',
      type: 'string',
      default: 'state.json',
    })
  }).command(
    'say <FILE>',
    'says something based on an existing corpus file',
    yargs => {
      return yargs.positional('FILE', {
        type: 'string',
      })
    }).argv

const command = args._[0];
const FILE = String(args.FILE);
const OUT = String(args.OUT);
switch (command) {
  case 'create':
    console.log(`Creating markov on corpus:'${FILE}' and saving to ${OUT}`);
    (async function () {
      const markov = await create(FILE);
      await save(markov, OUT);
    })();
    break;
  case 'say':
    console.log('loading from:', args.FILE);
    (async function () {
      const m = await load(FILE);
      m.generate();
    })();
    break;
  default:
    console.log(command, args);
}

async function save(m: Markov, stateFilename: string) {
  await fs.writeFile(stateFilename, m.Serialize())
}

async function create(corpusFilename: string): Promise<Markov> {
  try {
    const m = new Markov(2);
    const stream = getReadStream(corpusFilename);
    stream.on('line', (line: string) => {
      m.updateStateWithLine(line);
    })
    await once(stream, 'close');
    return m;
  } catch (err) {
    console.error(err);
  }
}

function getReadStream(filename: string) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity,
  })
  return rl;
}

async function load(corpusFilename: string): Promise<Markov> {
  const rawData = await fs.readFile(corpusFilename, 'utf-8');
  const data = JSON.parse(rawData);
  return Markov.Deserialize(data);
}
