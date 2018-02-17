import * as Viz from "viz.js";
import * as d3 from "d3-selection";
import {extractAllElementsData, extractElementData, createElementWithAttributes} from "./element";
import {convertToPathData} from "./svg";
import {pathTweenPoints} from "./tweening";
import {isEdgeElement} from "./data";
import {getEdgeTitle} from "./data";


export function initViz() {
    // force JIT compilation of Viz.js
    if (this._worker == null) {
        Viz("");
        this._dispatch.call("initEnd", this);
    } else {
        var scripts = d3.selectAll('script');
        var vizScript = scripts.filter(function() {
            return d3.select(this).attr('type') == 'javascript/worker';
        });
        var vizURL = vizScript.attr('src');
        var graphvizInstance = this;
        this._worker.onmessage = function(event) {
            graphvizInstance._dispatch.call("initEnd", this);
        };
        if (!vizURL.match(/^https?:\/\/|^\/\//i)) {
            // Local URL. Prepend with local domain to be usable in web worker
            vizURL = document.location.protocol + '//' + document.location.host + '/' + vizURL;
        }
        this._worker.postMessage({dot: "", vizURL: vizURL});
    }
}

export default function(src, callback) {

    var graphvizInstance = this;
    var worker = this._worker;
    var engine = this._engine;
    var images = this._images;
    var totalMemory = this._totalMemory;
    var keyMode = this._keyMode;
    var tweenPaths = this._tweenPaths;
    var tweenShapes = this._tweenShapes;
    var tweenPrecision = this._tweenPrecision;
    var growEnteringEdges = this._growEnteringEdges;
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
                    datum.key = title.children[0].text;
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
            if ((prevDatum.tag == 'polygon' || prevDatum.tag == 'ellipse') && (prevDatum.tag != datum.tag || datum.tag == 'polygon')) {
                datum.alternativeOld = convertToPathData(prevDatum, datum);
                datum.alternativeNew = convertToPathData(datum, prevDatum);
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
            (datum.alternativeOld || (datum.alternativeOld = {})).points = pathTweenPoints(oldNode, attribute_d, tweenPrecision);
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
                    var child = datum.children[0];
                    var nodeId = child.text;
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
                        datum.totalLength = path.totalLength;
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
                        if (startNode.children[3].tag == 'g' && startNode.children[3].children[0].tag == 'a') {
                            startNode = startNode.children[3].children[0];
                        }
                        if (prevStartNode.children[3].tag == 'g' && prevStartNode.children[3].children[0].tag == 'a') {
                            prevStartNode = prevStartNode.children[3].children[0];
                        }
                        var startShapes = startNode.children;
                        for (var i = 0; i < startShapes.length; i++) {
                            if (startShapes[i].tag == 'polygon' || startShapes[i].tag == 'ellipse') {
                                var startShape = startShapes[i];
                                break;
                            }
                        }
                        if (typeof startShape == 'undefined') {
                            throw Error('Unsupported start shape of node ' + startNodeId + '.\nPlease file an issue at https://github.com/magjac/d3-graphviz/issues');
                        }
                        var prevStartShapes = prevStartNode.children;
                        for (var i = 0; i < prevStartShapes.length; i++) {
                            if (prevStartShapes[i].tag == 'polygon' || prevStartShapes[i].tag == 'ellipse') {
                                var prevStartShape = prevStartShapes[i];
                                break;
                            }
                        }
                        if (typeof prevStartShape == 'undefined') {
                            throw Error('Unsupported previuous start shape of node ' + startNodeId + '.\nPlease file an issue at https://github.com/magjac/d3-graphviz/issues');
                        }
                        datum.offset = {
                            x: prevStartShape.center.x - startShape.center.x,
                            y: prevStartShape.center.y - startShape.center.y,
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

    this._dispatch.call("start", this);
    this._busy = true;
    this._dispatch.call("layoutStart", this);
    var vizOptions = {
        format: "svg",
        engine: engine,
        images: images,
        totalMemory: totalMemory,
    };
    if (this._worker) {
        worker.postMessage({
            dot: src,
            options: vizOptions,
        });

        worker.onmessage = function(event) {
            switch (event.data.type) {
            case "done":
                return layoutDone.call(graphvizInstance, event.data.svg);
            case "error":
                if (graphvizInstance._onerror) {
                    graphvizInstance._onerror(event.data.error);
                } else {
                    throw event.data.error
                }
                break;
            }
        };
    } else {
        try {
            var svgDoc = Viz(src, vizOptions);
        }
        catch(error) {
            if (graphvizInstance._onerror) {
                graphvizInstance._onerror(error.message);
                return;
            } else {
                throw error.message
            }
        }
        layoutDone.call(this, svgDoc);
    }

    function layoutDone(svgDoc) {
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

    return this;
};
