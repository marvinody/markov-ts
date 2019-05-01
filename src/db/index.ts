import { Edge, Vertex } from '../graph';
class DB {
  vertices: Vertex[]
  edges: Edge[]
  constructor() {
    this.edges = [];
    this.vertices = [];
  }
  FindOrCreateVertex(value: string) {
    let v = this.FindExistingVertex(value);
    if (v === undefined) {
      v = new Vertex(value);
      this.vertices.push(v);
    }
    return v;
  }

  FindExistingVertex(value: any): Vertex {
    return this.vertices.find(v => v.value === value);
  }

  FindExistingEdge(from: Vertex, to: Vertex): Edge {
    return this.edges.find(e => e.from.id === from.id && e.to.id === to.id);
  }

  UpsertEdge(from: Vertex, to: Vertex, initialWeight: number, updateIncrement: number): Edge {
    let edge = this.FindExistingEdge(from, to);
    if (edge === undefined) {
      edge = new Edge(from, to, initialWeight);
      this.edges.push(edge);
    } else {
      edge.weight += updateIncrement;
    }
    return edge;
  }

}

const db = new DB();
export default db;
