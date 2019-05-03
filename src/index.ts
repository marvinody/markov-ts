const fs = require('fs');
import * as yargs from 'yargs';

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
switch (command) {
  case 'create':
    console.log('creating: ', args.FILE, args.OUT)
    break;
  case 'say':
    console.log('saying from: ', args.FILE)
    break;
  default:
    console.log(command, args);
}

/*
const corpus = JSON.parse(fs.readFileSync(filename, 'utf8')).map(tweet => tweet.text);
const markov = markovify(corpus, 1);
let text = markov.generate();
*/
