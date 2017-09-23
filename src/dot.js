import * as Viz from "viz.js";
import * as d3 from "d3-selection";
import {extractElementData, createElementWithAttributes} from "./element";
import {convertToPathData} from "./svg";
import {pathTweenPoints} from "./tweening";
import {isEdgeElement} from "./data";
import {getEdgeTitle} from "./data";

export default function(src) {

    var engine = this._engine;
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

    function extractData(element, index = 0, parentData) {

        var datum = extractElementData(element);

        datum.parent = parentData;
        datum.children = [];
        var tag = datum.tag;
        if (tag == '#text') {
            datum.text = element.text();
        } else if (tag == '#comment') {
            datum.comment = element.text();
        }
        var children = d3.selectAll(element.node().childNodes);
        if (keyMode == 'index') {
            datum.key = index;
        } else if (tag[0] != '#') {
            if (keyMode == 'id') {
                datum.key = element.attr('id');
            } else if (keyMode == 'title') {
                element.select('title');
                var title = element.select('title');
                if (!title.empty()) {
                    datum.key = element.select('title').text();
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
        var id = (parentData ? parentData.id + '.' : '') + datum.key;
        datum.id = id;
        dictionary[id] = datum;
        var prevDatum = prevDictionary[id];
        if (tweenShapes && id in prevDictionary) {
            if ((prevDatum.tag == 'polygon' || prevDatum.tag == 'ellipse') && (prevDatum.tag != datum.tag || datum.tag == 'polygon')) {
                datum.alternativeOld = convertToPathData(prevDatum, datum);
                datum.alternativeNew = convertToPathData(datum, prevDatum);
            }
        }
        if (tweenPaths && prevDatum && (prevDatum.tag == 'path' || (datum.alternativeOld && datum.alternativeOld.tag == 'path'))) {
            var attribute_d = (datum.alternativeNew || datum).attributes.d;
            if (datum.alternativeOld) {
                var oldNode = createElementWithAttributes(datum.alternativeOld);
            } else {
                var oldNode = createElementWithAttributes(prevDatum);
            }
            (datum.alternativeOld || (datum.alternativeOld = {})).points = pathTweenPoints(oldNode, attribute_d, tweenPrecision);
        }

        var childTagIndexes = {};
        children.each(function () {
            if (this !== null) {
                var childTag = this.nodeName;
                if (childTag == 'ellipse' || childTag == 'polygon') {
                    childTag = 'path';
                }
                if (childTagIndexes[childTag] == null) {
                    childTagIndexes[childTag] = 0;
                }
                var childIndex = childTagIndexes[childTag]++;
                var childData = extractData(d3.select(this), childIndex, datum);
                if (childData) {
                    datum.children.push(childData);
                }
            }
        });
        return datum;
    }

    function postProcessData(datum) {

        var id = datum.id;
        var tag = datum.tag;
        var prevDatum = prevDictionary[id];
        if (growEnteringEdges && datum.parent) {
            if (datum.parent.attributes.class == 'node') {
                if (tag == 'title') {
                    var child = datum.children[0];
                    var nodeId = child.text;
                    nodeDictionary[nodeId] = datum.parent;
                }
            }
        }
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
                        var startShape = startNode.children[3];
                        if (startShape.tag == 'g' && startShape.children[0].tag == 'a') {
                            startShape = startShape.children[0].children[1];
                        }
                        var prevStartShape = prevStartNode.children[3];
                        if (prevStartShape.tag == 'g' && prevStartShape.children[0].tag == 'a') {
                            prevStartShape = prevStartShape.children[0].children[1];
                        }
                        if (startShape.tag != 'polygon' && startShape.tag != 'ellipse') {
                            throw Error('Unexpected tag: ' + startShape.tag + '. Please file an issue at https://github.com/magjac/d3-graphviz/issues');
                        }
                        if (prevStartShape.tag != 'polygon' && prevStartShape.tag != 'ellipse') {
                            throw Error('Unexpected tag: ' + prevStartShape.tag + '. Please file an issue at https://github.com/magjac/d3-graphviz/issues');
                        }
                        datum.offset = {
                            x: prevStartShape.center.x - startShape.center.x,
                            y: prevStartShape.center.y - startShape.center.y,
                        }
                    }
                }
            }
        }
        datum.children.forEach(function (childData) {
            postProcessData(childData);
        });
        return datum;
    }

    var svgDoc = Viz(src,
              {
                  format: "svg",
                  engine: engine,
                  totalMemory: totalMemory,
              }
             );

    var newDoc = d3.selection()
      .append('div')
      .attr('display', 'none');

    newDoc
        .html(svgDoc);

    var newSvg = newDoc
      .select('svg');

    var data = extractData(newSvg);
    var data = postProcessData(data);
    this._data = data;
    this._dictionary = dictionary;
    this._nodeDictionary = nodeDictionary;
    newDoc.remove();

    return this;
};
