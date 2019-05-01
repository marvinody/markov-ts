import db from './db';
import { Vertex } from './graph';
console.log('included');
class Markov {
  nodes: object;
  state: Number;
  principalNode: Vertex;
  terminalNode: Vertex;
  constructor(state) {
    this.nodes = {};
    this.state = state;
    this.principalNode = new Vertex('PRINCIPAL');
    this.terminalNode = new Vertex('TERMINAL');
  }
  addNode(v: Vertex): void {
    this.nodes[v.value] = v;
  }
  updateStateWithLine(line: string): void {
    const normalize = this.makeNormalizeFn();
    const words = line.split(' ').map(normalize);
    let tokens = this.tokenize(words);
    let prevNode = this.principalNode;
    // cycle the node to next
    tokens.forEach(token => {
      // make the token into a vertex or pull existing
      const newNode = db.FindOrCreateVertex(token);
      // update edge if exists or create new edge
      const edge = db.UpsertEdge(prevNode, newNode, 1, +1);
      // and loop
      prevNode = newNode;
    })
    db.UpsertEdge(prevNode, this.terminalNode, 1, +1);

  }
  // how do we normalize our string?
  makeNormalizeFn() {
    return (w: string) => w.trim().toLowerCase();
  }
  // tokenize will change a string list into "token" list
  // the main difference between them will be some string occurences are
  // further split into two
  tokenize(s: string[]): string[] {
    // special token regex
    const r = /[^\w:]/
    return s.reduce((acc: string[], cur: string): string[] => {
      const splitWords = [];
      // use for with an empty success clause
      for (let idx = cur.search(r); idx > -1 && cur.length > 0;) {
        // pull related data around idx
        const preWord = cur.slice(0, idx);
        const char = cur[idx];
        const postWord = cur.slice(idx + 1)
        if (preWord.length > 0) { // prevent empty pushes if leading punct.
          splitWords.push(preWord);
        }
        splitWords.push(char);
        cur = postWord;
      }
      // prevents dropping the word if nothing interesting (just chars)
      if (splitWords.length === 0) {
        splitWords.push(cur);
      }
      acc.push(...splitWords);
      return acc;
    }, []);
  }
}



// splitOnPredicate works similar to String.split but instead of a regex or string,
// it takes a predicate function. if the pred. returns true, we'll split
// function splitOnPredicate(s: string, fn: (c: string) => boolean): string[] {
//   return s.split('').reduce((acc: string[][], cur: string): string[][] => {
//     return acc;
//   }, []).map(s => s.join(''));
// }

const markovify = (corpus: string, state: Number): Markov => {
  const m = new Markov(state);
  return m;
}

export default markovify;
