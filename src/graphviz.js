import render from "./render";
import dot from "./dot";
import renderDot from "./renderDot";
import transition from "./transition";
import attributer from "./attributer";
import engine from "./engine";
import totalMemory from "./totalMemory";
import keyMode from "./keyMode";
import fade from "./fade";
import tweenPaths from "./tweenPaths";
import tweenShapes from "./tweenShapes";
import tweenPrecision from "./tweenPrecision";
import zoom from "./zoom";

export function Graphviz(selection) {
    this._selection = selection;
    this._active = false;
    this._jobs = [];
    this._keyModes = new Set([
        'title',
        'id',
        'tag-index',
        'index'
    ]);
    this._engine = 'dot';
    this._totalMemory = undefined;
    this._keyMode = 'title';
    this._fade = true;
    this._tweenPaths = true;
    this._tweenShapes = true;
    this._tweenPrecision = 1;
    this._translation = {x: 0, y: 0};
    this._zoom = false;
}

export default function graphviz(selection) {
    var g = new Graphviz(selection);
    return g;
}

Graphviz.prototype = graphviz.prototype = {
    constructor: Graphviz,
    engine: engine,
    totalMemory: totalMemory,
    keyMode: keyMode,
    fade: fade,
    tweenPaths: tweenPaths,
    tweenShapes: tweenShapes,
    tweenPrecision: tweenPrecision,
    zoom: zoom,
    render: render,
    dot: dot,
    renderDot: renderDot,
    transition: transition,
    attributer: attributer,
};
