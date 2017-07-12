import render from "./render";
import dot from "./dot";
import transition from "./transition";
import keyMode from "./keyMode";
import tweenPaths from "./tweenPaths";

export function Graphviz(selection) {
    this._selection = selection;
    this._keyModes = new Set([
        'title',
        'id',
        'tag-index',
        'index'
    ]);
    this._keyMode = 'title';
    this._tweenPaths = true;
}

export default function graphviz() {
  var g = new Graphviz;
  return g;
}

Graphviz.prototype = graphviz.prototype = {
    constructor: Graphviz,
    keyMode: keyMode,
    tweenPaths: tweenPaths,
    render: render,
    dot: dot,
    transition: transition,
};
