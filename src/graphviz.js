import * as d3 from "d3-selection";
import {dispatch} from "d3-dispatch";
import render from "./render";
import {layout} from "./dot";
import dot from "./dot";
import data from "./data";
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
import keyMode from "./keyMode";
import fade from "./fade";
import tweenPaths from "./tweenPaths";
import tweenShapes from "./tweenShapes";
import convertEqualSidedPolygons from "./convertEqualSidedPolygons";
import tweenPrecision from "./tweenPrecision";
import growEnteringEdges from "./growEnteringEdges";
import zoom from "./zoom";
import {resetZoom} from "./zoom";
import {zoomBehavior} from "./zoom";
import {zoomSelection} from "./zoom";
import {zoomScaleExtent} from "./zoom";
import {zoomTranslateExtent} from "./zoom";
import on from "./on";
import onerror from "./onerror";
import logEvents from "./logEvents";
import destroy from "./destroy";
import {drawEdge} from "./drawEdge";
import {updateDrawnEdge} from "./drawEdge";
import {moveDrawnEdgeEndPoint} from "./drawEdge";
import {insertDrawnEdge} from "./drawEdge";
import {removeDrawnEdge} from "./drawEdge";
import {drawnEdgeSelection} from "./drawEdge";
import {drawNode} from "./drawNode";
import {updateDrawnNode} from "./drawNode";
import {moveDrawnNode} from "./drawNode";
import {insertDrawnNode} from "./drawNode";
import {removeDrawnNode} from "./drawNode";
import {drawnNodeSelection} from "./drawNode";
import {workerCode} from "./workerCode";
import {sharedWorkerCode} from "./workerCode";
import {workerCodeBody} from "./workerCode";

export function Graphviz(selection, options) {
    this._options = {
        useWorker: true,
        useSharedWorker: false,
        engine: 'dot',
        keyMode: 'title',
        fade: true,
        tweenPaths: true,
        tweenShapes: true,
        convertEqualSidedPolygons: true,
        tweenPrecision: 1,
        growEnteringEdges: true,
        zoom: true,
        zoomScaleExtent: [0.1, 10],
        zoomTranslateExtent: [[-Infinity, -Infinity], [+Infinity, +Infinity]],
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
    var useSharedWorker = this._options.useSharedWorker;
    if (typeof Worker == 'undefined') {
        useWorker = false;
    }
    if (typeof SharedWorker == 'undefined') {
        useSharedWorker = false;
    }
    if (useWorker || useSharedWorker) {
        var scripts = d3.selectAll('script');
        var vizScript = scripts.filter(function() {
            return d3.select(this).attr('type') == 'javascript/worker' || (d3.select(this).attr('src') && d3.select(this).attr('src').match(/.*\/@hpcc-js\/wasm/));
        });
        if (vizScript.size() == 0) {
            console.warn('No script tag of type "javascript/worker" was found and "useWorker" is true. Not using web worker.');
            useWorker = false;
            useSharedWorker = false;
        } else {
            this._vizURL = vizScript.attr('src');
            if (!this._vizURL) {
                console.warn('No "src" attribute of was found on the "javascript/worker" script tag and "useWorker" is true. Not using web worker.');
                useWorker = false;
                useSharedWorker = false;
            }
        }
    }
    if (useSharedWorker) {
        const url = 'data:application/javascript;base64,' + btoa(workerCodeBody.toString() + '(' + sharedWorkerCode.toString() + ')()');
        this._worker = this._worker = new SharedWorker(url);
        this._workerPort = this._worker.port;
        this._workerPortClose = this._worker.port.close.bind(this._workerPort);
        this._worker.port.start();
        this._workerCallbacks = [];
    }
    else if (useWorker) {
        var blob = new Blob([workerCodeBody.toString() + '(' + workerCode.toString() + ')()']);
        var blobURL = window.URL.createObjectURL(blob);
        this._worker = new Worker(blobURL);
        this._workerPort = this._worker;
        this._workerPortClose = this._worker.terminate.bind(this._worker);
        this._workerCallbacks = [];
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
    this._scale = undefined;
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
    keyMode: keyMode,
    fade: fade,
    tweenPaths: tweenPaths,
    tweenShapes: tweenShapes,
    convertEqualSidedPolygons: convertEqualSidedPolygons,
    tweenPrecision: tweenPrecision,
    growEnteringEdges: growEnteringEdges,
    zoom: zoom,
    resetZoom: resetZoom,
    zoomBehavior: zoomBehavior,
    zoomSelection: zoomSelection,
    zoomScaleExtent: zoomScaleExtent,
    zoomTranslateExtent: zoomTranslateExtent,
    render: render,
    layout: layout,
    dot: dot,
    data: data,
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
    destroy: destroy,
    drawEdge: drawEdge,
    updateDrawnEdge: updateDrawnEdge,
    moveDrawnEdgeEndPoint,
    insertDrawnEdge,
    removeDrawnEdge, removeDrawnEdge,
    drawnEdgeSelection, drawnEdgeSelection,
    drawNode: drawNode,
    updateDrawnNode: updateDrawnNode,
    moveDrawnNode: moveDrawnNode,
    insertDrawnNode,
    removeDrawnNode, removeDrawnNode,
    drawnNodeSelection, drawnNodeSelection,
};
