import render from "./render";
import dot from "./dot";

export function Graphviz(selection) {
    this._selection = selection;
}

export default function graphviz() {
  var g = new Graphviz;
  return g;
}

Graphviz.prototype = graphviz.prototype = {
    constructor: Graphviz,
    render: render,
    dot: dot,
};
