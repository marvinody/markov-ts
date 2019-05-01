import db from './db';
import markovify from './markov';
const corpus = `
  there is a quick brown fox.
  the quick brown fox jumped over the lazy dog.
  the lazy dog jumped over the quick brown fox.
  the lazy dog loves cake.
  dog loves treats.
  dog loves treats so much.
  so much of our time is spent doing silly things.
  the lazy dog jumped, because he loved using commands and questioning?
  LUL LUL LUL LUL LUL
`

const markov = markovify(corpus, 1);
let text = markov.generate();
let v = db.vertices[db.vertices.length - 1]
console.log(text);
