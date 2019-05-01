import db from './db';
import { Vertex } from './graph';
class Markov {
  state: Number;
  principalNode: Vertex;
  terminalNode: Vertex;
  constructor(state) {
    this.state = state;
    this.principalNode = new Vertex('PRINCIPAL');
    this.terminalNode = new Vertex('END OF LINE');
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
  generate(): string {
    const list: Vertex[] = [];
    let curNode = this.principalNode;
    while (curNode.id != this.terminalNode.id) { // we'll stop when we reach the terminal node
      const { vertex, ok } = db.FindRandomVertexFrom(curNode);
      if (ok) { //
        list.push(vertex);
        curNode = vertex;
      }
    }
    return list.map(v => v.value).join(' ');
  }

}

const markovify = (corpus: string, state: Number): Markov => {
  const markov = new Markov(state);
  const lines = corpus
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
  lines.forEach(l => markov.updateStateWithLine(l))
  return markov;
}

export default markovify;
