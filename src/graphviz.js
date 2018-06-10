import * as d3 from "d3-selection";
import {dispatch} from "d3-dispatch";
import render from "./render";
import dot from "./dot";
import {initViz} from "./dot";
import renderDot from "./renderDot";
import transition from "./transition";
import {active} from "./transition";
import options from "./options";
import width from "./width";
import height from "./height";
import scale from "./scale";
import fit from "./fit";
import attributer from "./attributer";
import engine from "./engine";
import images from "./images";
import totalMemory from "./totalMemory";
import keyMode from "./keyMode";
import fade from "./fade";
import tweenPaths from "./tweenPaths";
import tweenShapes from "./tweenShapes";
import convertEqualSidedPolygons from "./convertEqualSidedPolygons";
import tweenPrecision from "./tweenPrecision";
import growEnteringEdges from "./growEnteringEdges";
import zoom from "./zoom";
import {resetZoom} from "./zoom";
import on from "./on";
import onerror from "./onerror";
import logEvents from "./logEvents";
import {drawEdge} from "./drawEdge";
import {updateDrawnEdge} from "./drawEdge";
import {moveDrawnEdgeEndPoint} from "./drawEdge";
import {insertDrawnEdge} from "./drawEdge";
import {removeDrawnEdge} from "./drawEdge";
import {drawNode} from "./drawNode";
import {updateDrawnNode} from "./drawNode";
import {insertDrawnNode} from "./drawNode";
import {removeDrawnNode} from "./drawNode";

export function Graphviz(selection, options) {
    this._options = {
        useWorker: true,
        engine: 'dot',
        totalMemory: undefined,
        keyMode: 'title',
        fade: true,
        tweenPaths: true,
        tweenShapes: true,
        convertEqualSidedPolygons: true,
        tweenPrecision: 1,
        growEnteringEdges: true,
        zoom: true,
        width: null,
        height: null,
        scale: 1,
        fit: false,
    };
    if (options instanceof Object) {
        for (var option of Object.keys(options)) {
            this._options[option] = options[option];
        }
    } else if (typeof options == 'boolean') {
        this._options.useWorker = options;
    }
    var useWorker = this._options.useWorker;
    if (typeof Worker == 'undefined') {
        useWorker = false;
    }
    if (useWorker) {
        var scripts = d3.selectAll('script');
        var vizScript = scripts.filter(function() {
            return d3.select(this).attr('type') == 'javascript/worker' || (d3.select(this).attr('src') && d3.select(this).attr('src').match(/.*\/viz.js$/));
        });
        if (vizScript.size() == 0) {
            console.warn('No script tag of type "javascript/worker" was found and "useWorker" is true. Not using web worker.');
            useWorker = false;
        } else {
            this._vizURL = vizScript.attr('src');
            if (!this._vizURL) {
                console.warn('No "src" attribute of was found on the "javascript/worker" script tag and "useWorker" is true. Not using web worker.');
                useWorker = false;
            }
        }
    }
    if (useWorker) {
        var js = `
            onmessage = function(event) {
                if (event.data.vizURL) {
                    importScripts(event.data.vizURL);
                }
                try {
                    var svg = Viz(event.data.dot, event.data.options);
                }
                catch(error) {
                    postMessage({
                        type: "error",
                        error: error.message,
                    });
                    return;
                }
                if (svg) {
                    postMessage({
                        type: "done",
                        svg: svg,
                    });
                } else {
                    postMessage({
                        type: "skip",
                    });
                }
            }
        `;
        var blob = new Blob([js]);
        var blobURL = window.URL.createObjectURL(blob);
        this._worker = new Worker(blobURL);
    }
    this._selection = selection;
    this._active = false;
    this._busy = false;
    this._jobs = [];
    this._queue = [];
    this._keyModes = new Set([
        'title',
        'id',
        'tag-index',
        'index'
    ]);
    this._images = [];
    this._translation = undefined;
    this._eventTypes = [
        'initEnd',
        'start',
        'layoutStart',
        'layoutEnd',
        'dataExtractEnd',
        'dataProcessPass1End',
        'dataProcessPass2End',
        'dataProcessEnd',
        'renderStart',
        'renderEnd',
        'transitionStart',
        'transitionEnd',
        'restoreEnd',
        'end'
    ];
    this._dispatch = dispatch(...this._eventTypes);
    initViz.call(this);
    selection.node().__graphviz__ = this;
}

export default function graphviz(selector, options) {
    var g = d3.select(selector).graphviz(options);
    return g;
}

Graphviz.prototype = graphviz.prototype = {
    constructor: Graphviz,
    engine: engine,
    addImage: images,
    totalMemory: totalMemory,
    keyMode: keyMode,
    fade: fade,
    tweenPaths: tweenPaths,
    tweenShapes: tweenShapes,
    convertEqualSidedPolygons: convertEqualSidedPolygons,
    tweenPrecision: tweenPrecision,
    growEnteringEdges: growEnteringEdges,
    zoom: zoom,
    resetZoom: resetZoom,
    render: render,
    dot: dot,
    renderDot: renderDot,
    transition: transition,
    active: active,
    options: options,
    width: width,
    height: height,
    scale: scale,
    fit: fit,
    attributer: attributer,
    on: on,
    onerror: onerror,
    logEvents: logEvents,
    drawEdge: drawEdge,
    updateDrawnEdge: updateDrawnEdge,
    moveDrawnEdgeEndPoint,
    insertDrawnEdge,
    removeDrawnEdge, removeDrawnEdge,
    drawNode: drawNode,
    updateDrawnNode: updateDrawnNode,
    insertDrawnNode,
    removeDrawnNode, removeDrawnNode,
};
