import { Graphviz } from "@hpcc-js/wasm/graphviz";
import * as d3 from "d3-selection";
import {extractAllElementsData, extractElementData, createElementWithAttributes} from "./element.js";
import {convertToPathData} from "./svg.js";
import {pathTweenPoints} from "./tweening.js";
import {isEdgeElement} from "./data.js";
import {getEdgeTitle} from "./data.js";


export function initViz() {

    // force JIT compilation of @hpcc-js/wasm
    try {
        Graphviz.load().then(graphviz => {
            graphviz.layout("", "svg", "dot");
            this.layoutSync = graphviz.layout.bind(graphviz);
            if (this._worker == null) {
                this._dispatch.call("initEnd", this);
            }
            if (this._afterInit) {
                this._afterInit();
            }
        });
// after the port to ESM modules, we don't know how to trigger this so
// we just disable it from coverage
/* c8 ignore start */
    } catch(error) {
        // we end up here when the the script tag type used to load
        // the "@hpcc-js/wasm" script is not "application/javascript"
        // or "text/javascript", but typically "javascript/worker". In
        // this case the browser does not load the script since it's
        // unnecessary because it's loaded by the web worker
        // instead. This is expected so we just ignore the error.
    }
/* c8 ignore stop */
    if (this._worker != null) {
        var vizURL = this._vizURL;
        var graphvizInstance = this;
        this._workerPort.onmessage = function(event) {
            var callback = graphvizInstance._workerCallbacks.shift();
            callback.call(graphvizInstance, event);
        }
        if (!vizURL.match(/^https?:\/\/|^\/\//i)) {
            // Local URL. Prepend with local domain to be usable in web worker
            vizURL = (new window.URL(vizURL, document.location.href)).href;
        }
        postMessage.call(this, {type: "layout", dot: "", engine: 'dot', vizURL: vizURL}, function (event) {
            switch (event.data.type) {
            case "init":
                break;
            }
        });
        postMessage.call(this, { type: "version" }, function (event) {
            switch (event.data.type) {
                case "version":
                    graphvizInstance._graphvizVersion = event.data.version;
                    graphvizInstance._dispatch.call("initEnd", this);
                    break;
            }
        });
    }
}

function postMessage(message, callback) {
    this._workerCallbacks.push(callback);
    this._workerPort.postMessage(message);
}

export function layout(src, engine, vizOptions, callback) {
    if (this._worker) {
        postMessage.call(this, {
            type: "layout",
            dot: src,
            engine: engine,
            options: vizOptions,
        }, function (event) {
            callback.call(this, event.data);
        });
    } else {
        try {
            var svgDoc = this.layoutSync(src, "svg", engine, vizOptions);
            callback.call(this, {type: 'done', svg: svgDoc});
        }
        catch(error) {
            callback.call(this, {type: 'error', error: error.message});
        }
    }
}

export default function(src, callback) {

    var graphvizInstance = this;
    var worker = this._worker;
    var engine = this._options.engine;
    var images = this._images;

    this._dispatch.call("start", this);
    this._busy = true;
    this._dispatch.call("layoutStart", this);
    var vizOptions = {
        images: images,
    };
    if (!this._worker && this.layoutSync == null) {
        this._afterInit = this.dot.bind(this, src, callback);
        return this;
    }
    this.layout(src, engine, vizOptions, function (data) {
        switch (data.type) {
        case "error":
            if (graphvizInstance._onerror) {
                graphvizInstance._onerror(data.error);
            } else {
                throw data.error.message
            }
            break;
        case "done":
            var svgDoc = data.svg;
            layoutDone.call(this, svgDoc, callback);
            break;
        }
    });

    return this;
};

function layoutDone(svgDoc, callback) {
    var keyMode = this._options.keyMode;
    var tweenPaths = this._options.tweenPaths;
    var tweenShapes = this._options.tweenShapes;
    if (typeof this._options.tweenPrecision == 'string' && this._options.tweenPrecision.includes('%')) {
        var tweenPrecision = +this._options.tweenPrecision.split('%')[0] / 100;
        var tweenPrecisionIsRelative = this._options.tweenPrecision.includes('%');
    } else {
        var tweenPrecision = this._options.tweenPrecision;
        var tweenPrecisionIsRelative = false;
    }
    var growEnteringEdges = this._options.growEnteringEdges;
    var dictionary = {};
    var prevDictionary = this._dictionary || {};
    var nodeDictionary = {};
    var prevNodeDictionary = this._nodeDictionary || {};

    function setKey(datum, index) {
        var tag = datum.tag;
        if (keyMode == 'index') {
            datum.key = index;
        } else if (tag[0] != '#') {
            if (keyMode == 'id') {
                datum.key = datum.attributes.id;
            } else if (keyMode == 'title') {
                var title = datum.children.find(function (childData) {
                    return childData.tag == 'title';
                });
                if (title) {
                    if (title.children.length > 0) {
                        datum.key = title.children[0].text;
                    } else {
                        datum.key = '';
                    }
                }
            }
        }
        if (datum.key == null) {
            if (tweenShapes) {
                if (tag == 'ellipse' || tag == 'polygon') {
                    tag = 'path';
                }
            }
            datum.key = tag + '-' + index;
        }
    }

    function setId(datum, parentData) {
        var id = (parentData ? parentData.id + '.' : '') + datum.key;
        datum.id = id;
    }

    function addToDictionary(datum) {
        dictionary[datum.id] = datum;
    }

    function calculateAlternativeShapeData(datum, prevDatum) {
        if (tweenShapes && datum.id in prevDictionary) {
            if ((prevDatum.tag == 'polygon' || prevDatum.tag == 'ellipse' || prevDatum.tag == 'path') && (prevDatum.tag != datum.tag || datum.tag == 'polygon')) {
                if (prevDatum.tag != 'path') {
                    datum.alternativeOld = convertToPathData(prevDatum, datum);
                }
                if (datum.tag != 'path') {
                    datum.alternativeNew = convertToPathData(datum, prevDatum);
                }
            }
        }
    }

    function calculatePathTweenPoints(datum, prevDatum) {
        if (tweenPaths && prevDatum && (prevDatum.tag == 'path' || (datum.alternativeOld && datum.alternativeOld.tag == 'path'))) {
            var attribute_d = (datum.alternativeNew || datum).attributes.d;
            if (datum.alternativeOld) {
                var oldNode = createElementWithAttributes(datum.alternativeOld);
            } else {
                var oldNode = createElementWithAttributes(prevDatum);
            }
            (datum.alternativeOld || (datum.alternativeOld = {})).points = pathTweenPoints(oldNode, attribute_d, tweenPrecision, tweenPrecisionIsRelative);
        }
    }

    function postProcessDataPass1Local(datum, index=0, parentData) {
        setKey(datum, index);
        setId(datum, parentData);
        var id = datum.id;
        var prevDatum = prevDictionary[id];
        addToDictionary(datum);
        calculateAlternativeShapeData(datum, prevDatum);
        calculatePathTweenPoints(datum, prevDatum);
        var childTagIndexes = {};
        datum.children.forEach(function (childData) {
            var childTag = childData.tag;
            if (childTag == 'ellipse' || childTag == 'polygon') {
                childTag = 'path';
            }
            if (childTagIndexes[childTag] == null) {
                childTagIndexes[childTag] = 0;
            }
            var childIndex = childTagIndexes[childTag]++;
            postProcessDataPass1Local(childData, childIndex, datum);
        });
    }

    function addToNodeDictionary(datum) {
        var tag = datum.tag;
        if (growEnteringEdges && datum.parent) {
            if (datum.parent.attributes.class == 'node') {
                if (tag == 'title') {
                    if (datum.children.length > 0) {
                      var child = datum.children[0];
                      var nodeId = child.text;
                    } else {
                      var nodeId = '';
                    }
                    nodeDictionary[nodeId] = datum.parent;
                }
            }
        }
    }

    function extractGrowingEdgesData(datum) {
        var id = datum.id;
        var tag = datum.tag;
        var prevDatum = prevDictionary[id];
        if (growEnteringEdges && !prevDatum && datum.parent) {
            if (isEdgeElement(datum)) {
                if (tag == 'path' || tag == 'polygon') {
                    if (tag == 'polygon') {
                        var path = datum.parent.children.find(function (e) {
                            return e.tag == 'path';
                        });
                        if (path) {
                            datum.totalLength = path.totalLength;
                        }
                    }
                    var title = getEdgeTitle(datum);
                    var child = title.children[0];
                    var nodeIds = child.text.split('->');
                    if (nodeIds.length != 2) {
                        nodeIds = child.text.split('--');
                    }
                    var startNodeId = nodeIds[0];
                    var startNode = nodeDictionary[startNodeId];
                    var prevStartNode = prevNodeDictionary[startNodeId];
                    if (prevStartNode) {
                        var i = startNode.children.findIndex(function (element, index) {
                            return element.tag == 'g';
                        });
                        if (i >= 0) {
                            var j = startNode.children[i].children.findIndex(function (element, index) {
                                return element.tag == 'a';
                            });
                            startNode = startNode.children[i].children[j];
                        }
                        var i = prevStartNode.children.findIndex(function (element, index) {
                            return element.tag == 'g';
                        });
                        if (i >= 0) {
                            var j = prevStartNode.children[i].children.findIndex(function (element, index) {
                                return element.tag == 'a';
                            });
                            prevStartNode = prevStartNode.children[i].children[j];
                        }
                        var startShapes = startNode.children;
                        for (var i = 0; i < startShapes.length; i++) {
                            if (startShapes[i].tag == 'polygon' || startShapes[i].tag == 'ellipse' || startShapes[i].tag == 'path' || startShapes[i].tag == 'text') {
                                var startShape = startShapes[i];
                                break;
                            }
                        }
                        var prevStartShapes = prevStartNode.children;
                        for (var i = 0; i < prevStartShapes.length; i++) {
                            if (prevStartShapes[i].tag == 'polygon' || prevStartShapes[i].tag == 'ellipse' || prevStartShapes[i].tag == 'path' || prevStartShapes[i].tag == 'text') {
                                var prevStartShape = prevStartShapes[i];
                                break;
                            }
                        }
                        if (prevStartShape && startShape) {
                            datum.offset = {
                                x: prevStartShape.center.x - startShape.center.x,
                                y: prevStartShape.center.y - startShape.center.y,
                            }
                        } else {
                            datum.offset = {x: 0, y: 0};
                        }
                    }
                }
            }
        }
    }

    function postProcessDataPass2Global(datum) {
        addToNodeDictionary(datum);
        extractGrowingEdgesData(datum);
        datum.children.forEach(function (childData) {
            postProcessDataPass2Global(childData);
        });
    }

    this._dispatch.call("layoutEnd", this);

    var newDoc = d3.select(document.createDocumentFragment())
        .append('div');

    var parser = new window.DOMParser();
    var doc = parser.parseFromString(svgDoc, "image/svg+xml");

    newDoc
        .append(function() {
            return doc.documentElement;
        });

    var newSvg = newDoc
      .select('svg');

    var data = extractAllElementsData(newSvg);
    this._dispatch.call('dataExtractEnd', this);
    postProcessDataPass1Local(data);
    this._dispatch.call('dataProcessPass1End', this);
    postProcessDataPass2Global(data);
    this._dispatch.call('dataProcessPass2End', this);
    this._data = data;
    this._dictionary = dictionary;
    this._nodeDictionary = nodeDictionary;

    this._extractData = function (element, childIndex, parentData) {
        var data = extractAllElementsData(element);
        postProcessDataPass1Local(data, childIndex, parentData);
        postProcessDataPass2Global(data);
        return data;
    }
    this._busy = false;
    this._dispatch.call('dataProcessEnd', this);
    if (callback) {
        callback.call(this);
    }
    if (this._queue.length > 0) {
        var job = this._queue.shift();
        job.call(this);
    }
}
