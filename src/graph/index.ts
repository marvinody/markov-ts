import newID from './id';

class Edge {
  id: number
  from: Vertex;
  to: Vertex;
  weight: number;
  // Create an edge with a unique ID and from/to values realted to passed vertices
  constructor(from: Vertex, to: Vertex, weight: number) {
    this.id = newID();
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}


class Vertex {
  id: number
  value: string
  edgesTo: Edge[]
  edgesFrom: Edge[]

  // Create a vertex with a  unique ID and any value to hold
  constructor(value: any) {
    this.id = newID();
    this.value = value;
    this.edgesTo = [];
    this.edgesFrom = [];
  }
  // MakeEdgeTo will create an edge and add it to the vertices' edge array
  MakeEdgeTo(to: Vertex, weight: number) {
    const edge = new Edge(this, to, weight);
    // add the edge to both since we might need them.
    // Waste of space rn, but should help in db design for going backwards?
    this.edgesFrom.push(edge);
    to.edgesTo.push(edge);
  }
}

export { Vertex, Edge };

