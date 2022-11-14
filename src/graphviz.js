import * as d3 from "d3-selection";
import {dispatch} from "d3-dispatch";
import render from "./render.js";
import graphvizVersion from "./graphvizVersion.js";
import {layout} from "./dot.js";
import dot from "./dot.js";
import data from "./data.js";
import {initViz} from "./dot.js";
import renderDot from "./renderDot.js";
import transition from "./transition.js";
import {active} from "./transition.js";
import options from "./options.js";
import width from "./width.js";
import height from "./height.js";
import scale from "./scale.js";
import fit from "./fit.js";
import attributer from "./attributer.js";
import engine from "./engine.js";
import images from "./images.js";
import keyMode from "./keyMode.js";
import fade from "./fade.js";
import tweenPaths from "./tweenPaths.js";
import tweenShapes from "./tweenShapes.js";
import convertEqualSidedPolygons from "./convertEqualSidedPolygons.js";
import tweenPrecision from "./tweenPrecision.js";
import growEnteringEdges from "./growEnteringEdges.js";
import zoom from "./zoom.js";
import {resetZoom} from "./zoom.js";
import {zoomBehavior} from "./zoom.js";
import {zoomSelection} from "./zoom.js";
import {zoomScaleExtent} from "./zoom.js";
import {zoomTranslateExtent} from "./zoom.js";
import on from "./on.js";
import onerror from "./onerror.js";
import logEvents from "./logEvents.js";
import destroy from "./destroy.js";
import {drawEdge} from "./drawEdge.js";
import {updateDrawnEdge} from "./drawEdge.js";
import {moveDrawnEdgeEndPoint} from "./drawEdge.js";
import {insertDrawnEdge} from "./drawEdge.js";
import {removeDrawnEdge} from "./drawEdge.js";
import {drawnEdgeSelection} from "./drawEdge.js";
import {drawNode} from "./drawNode.js";
import {updateDrawnNode} from "./drawNode.js";
import {moveDrawnNode} from "./drawNode.js";
import {insertDrawnNode} from "./drawNode.js";
import {removeDrawnNode} from "./drawNode.js";
import {drawnNodeSelection} from "./drawNode.js";
import {workerCode} from "./workerCode.js";
import {sharedWorkerCode} from "./workerCode.js";
import {workerCodeBody} from "./workerCode.js";
import {Graphviz as hpccWasmGraphviz} from "@hpcc-js/wasm/graphviz";

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
    } else {
        hpccWasmGraphviz.load().then(((graphviz) => {
            this._graphvizVersion = graphviz.version();
        }).bind(this));
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
        'end',
        'zoom'
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
    graphvizVersion: graphvizVersion,
};
