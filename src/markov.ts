import db from './db';
import { Vertex } from './graph';
class Markov {
  state: number;
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
      if (cur.startsWith("http")) {
        return acc;
      }
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
  Serialize(): SerializedMarkov {
    return {
      state: this.state,
      start: [this.principalNode.id, this.principalNode.value],
      end: [this.terminalNode.id, this.terminalNode.value],
      nodes: db.vertices.map(v => [v.id, v.value]),
      edges: db.edges.map(e => [e.from.id, e.to.id, e.weight]),
    }
  }
  static Deserialize(o: SerializedMarkov): Markov {
    const m = new Markov(o.state);
    // grab principal stuff
    const principal = new Vertex(o.start[1]);
    principal.id = o.start[0];
    // grab terminal stuff
    const terminal = new Vertex(o.end[1]);
    terminal.id = o.end[0];
    // set the important nodes
    m.principalNode = principal;
    m.terminalNode = terminal;
    // id -> vertex
    const idMap: { [key: number]: Vertex; } = {};
    idMap[principal.id] = principal;
    idMap[terminal.id] = terminal;
    // create vertices for everything
    db.vertices = db.vertices.concat(o.nodes.map(([id, value]) => {
      let v = new Vertex(value);
      v.id = id;
      idMap[id] = v;
      return v;
    }))
    db.edges = o.edges.map(([fromID, toID, weight]) => {
      const from = idMap[fromID];
      const to = idMap[toID];
      return from.MakeEdgeTo(to, weight)
    });
    db.SetAutoIncrement(db.edges.length + db.vertices.length);
    return m;
  }
}
type SerializedNode = [number, string]
type SerializedEdge = [number, number, number];
type SerializedMarkov = {
  state: number,
  start: SerializedNode,
  end: SerializedNode,
  nodes: Array<SerializedNode>,
  edges: Array<SerializedEdge>,
}
const markovify = (corpus: string[], state: Number): Markov => {
  const markov = new Markov(state);
  const lines = corpus
    .map(l => l.trim())
    .filter(l => l.length > 0)
  lines.forEach(l => markov.updateStateWithLine(l))
  return markov;
}

export { markovify, Markov };

