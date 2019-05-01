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
`

const markov = markovify(corpus, 1);
console.log(markov.tokenize('how are you, friend?'.split(' ')));
console.log(markov.tokenize('!!!'.split(' ')));
console.log(markov.tokenize('we Kappa :)'.split(' ')));
