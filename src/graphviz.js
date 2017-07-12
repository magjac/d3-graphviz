import render from "./render";
import dot from "./dot";
import transition from "./transition";
import keyMode from "./keyMode";

export function Graphviz(selection) {
    this._selection = selection;
    this._keyModes = new Set([
        'title',
        'id',
        'tag-index',
        'index'
    ]);
    this._keyMode = 'title';
}

export default function graphviz() {
  var g = new Graphviz;
  return g;
}

Graphviz.prototype = graphviz.prototype = {
    constructor: Graphviz,
    keyMode: keyMode,
    render: render,
    dot: dot,
    transition: transition,
};
