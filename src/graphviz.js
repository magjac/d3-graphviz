import render from "./render";
import dot from "./dot";
import renderDot from "./renderDot";
import transition from "./transition";
import keyMode from "./keyMode";
import tweenPaths from "./tweenPaths";
import tweenShapes from "./tweenShapes";

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
    this._tweenShapes = true;
}

export default function graphviz() {
  var g = new Graphviz;
  return g;
}

Graphviz.prototype = graphviz.prototype = {
    constructor: Graphviz,
    keyMode: keyMode,
    tweenPaths: tweenPaths,
    tweenShapes: tweenShapes,
    render: render,
    dot: dot,
    renderDot: renderDot,
    transition: transition,
};
