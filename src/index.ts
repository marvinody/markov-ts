const fs = require('fs');
import markovify from './markov';
const filename = process.argv[2]
if (filename === undefined) {
  throw Error("Need a filename to be passed to build corpus")
}

const corpus = JSON.parse(fs.readFileSync(filename, 'utf8')).map(tweet => tweet.text);
const markov = markovify(corpus, 1);
let text = markov.generate();
console.log(text);

console.log(markov.generate())
console.log(markov.generate())
console.log(markov.generate())
console.log(markov.generate())
console.log(markov.generate())
