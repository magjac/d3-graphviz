import * as d3 from "d3-selection";
import {path as d3_path} from "d3-path";
import {rotate} from "./geometry.js";
import {extractAllElementsData} from "./element.js";
import {attributeElement} from "./element.js";
import {insertAllElementsData} from "./element.js";

export function drawEdge(x1, y1, x2, y2, attributes, options={}) {
    attributes = Object.assign({}, attributes);
    if (attributes.style && attributes.style.includes('invis')) {
        var newEdge = d3.select(null);
    } else {
        var root = this._selection;
        var svg = root.selectWithoutDataPropagation("svg");
        var graph0 = svg.selectWithoutDataPropagation("g");
        var newEdge0 = createEdge.call(this, attributes);
        var edgeData = extractAllElementsData(newEdge0);
        var newEdge = graph0.append('g')
            .data([edgeData]);
        attributeElement.call(newEdge.node(), edgeData);
        _updateEdge.call(this, newEdge, x1, y1, x2, y2, attributes, options);
    }
    this._drawnEdge = {
        g: newEdge,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        attributes: attributes,
    };

    return this;
}

export function updateDrawnEdge(x1, y1, x2, y2, attributes={}, options={}) {
    if (!this._drawnEdge)  {
        throw Error('No edge has been drawn');
    }
    var edge = this._drawnEdge.g
    attributes = Object.assign(this._drawnEdge.attributes, attributes);
    this._drawnEdge.x1 = x1;
    this._drawnEdge.y1 = y1;
    this._drawnEdge.x2 = x2;
    this._drawnEdge.y2 = y2;
    if (edge.empty() && !(attributes.style && attributes.style.includes('invis'))) {
        var root = this._selection;
        var svg = root.selectWithoutDataPropagation("svg");
        var graph0 = svg.selectWithoutDataPropagation("g");
        var edge = graph0.append('g');
        this._drawnEdge.g = edge;
    }
    if (!edge.empty())  {
      _updateEdge.call(this, edge, x1, y1, x2, y2, attributes, options);
    }

    return this;
}

function _updateEdge(edge, x1, y1, x2, y2, attributes, options) {

    var newEdge = createEdge.call(this, attributes);
    var edgeData = extractAllElementsData(newEdge);
    edge.data([edgeData]);
    attributeElement.call(edge.node(), edgeData);
    _moveEdge(edge, x1, y1, x2, y2, attributes, options);
}

function _moveEdge(edge, x1, y1, x2, y2, attributes, options) {

    var shortening = options.shortening || 0;
    var arrowHeadLength = 10;
    var arrowHeadWidth = 7;
    var margin = 0.1;

    var arrowHeadPoints = [
        [0, -arrowHeadWidth / 2],
        [arrowHeadLength, 0],
        [0, arrowHeadWidth / 2],
        [0, -arrowHeadWidth / 2],
    ];

    var dx = x2 - x1;
    var dy = y2 - y1;
    var length = Math.sqrt(dx * dx + dy * dy);
    if (length == 0) {
        var cosA = 1;
        var sinA = 0;
    } else {
        var cosA = dx / length;
        var sinA = dy / length;
    }
    x2 = x1 + (length - shortening - arrowHeadLength - margin) * cosA;
    y2 = y1 + (length - shortening - arrowHeadLength - margin) * sinA;

    if (attributes.URL || attributes.tooltip) {
        var a = edge.selectWithoutDataPropagation("g").selectWithoutDataPropagation("a");
        var line = a.selectWithoutDataPropagation("path");
        var arrowHead = a.selectWithoutDataPropagation("polygon");
    } else {
        var line = edge.selectWithoutDataPropagation("path");
        var arrowHead = edge.selectWithoutDataPropagation("polygon");
    }

    var path1 = d3_path();
    path1.moveTo(x1, y1);
    path1.lineTo(x2, y2);

    line
        .attr("d", path1);

    x2 = x1 + (length - shortening - arrowHeadLength) * cosA;
    y2 = y1 + (length - shortening - arrowHeadLength) * sinA;
    for (var i = 0; i < arrowHeadPoints.length; i++) {
        var point = arrowHeadPoints[i];
        arrowHeadPoints[i] = rotate(point[0], point[1], cosA, sinA);
    }
    for (var i = 0; i < arrowHeadPoints.length; i++) {
        var point = arrowHeadPoints[i];
        arrowHeadPoints[i] = [x2 + point[0], y2 + point[1]];
    }
    var allPoints = [];
    for (var i = 0; i < arrowHeadPoints.length; i++) {
        var point = arrowHeadPoints[i];
        allPoints.push(point.join(','));
    }
    var pointsAttr = allPoints.join(' ');

    arrowHead
        .attr("points", pointsAttr);

    return this;
}

export function moveDrawnEdgeEndPoint(x2, y2, options={}) {

    if (!this._drawnEdge)  {
        throw Error('No edge has been drawn');
    }
    var edge = this._drawnEdge.g;
    var x1 = this._drawnEdge.x1;
    var y1 = this._drawnEdge.y1;
    var attributes = this._drawnEdge.attributes;

    this._drawnEdge.x2 = x2;
    this._drawnEdge.y2 = y2;
    _moveEdge(edge, x1, y1, x2, y2, attributes, options);

    return this
}

export function removeDrawnEdge() {

    if (!this._drawnEdge)  {
        return this;
    }

    var edge = this._drawnEdge.g;

    edge.remove();

    this._drawnEdge = null;

    return this
}

export function insertDrawnEdge(name) {

    if (!this._drawnEdge)  {
        throw Error('No edge has been drawn');
    }

    var edge = this._drawnEdge.g;
    if (edge.empty())  {
        return this;
    }
    var attributes = this._drawnEdge.attributes;

    var title = edge.selectWithoutDataPropagation("title");
    title
        .text(name);

    var root = this._selection;
    var svg = root.selectWithoutDataPropagation("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var graph0Datum = graph0.datum();
    var edgeData = this._extractData(edge, graph0Datum.children.length, graph0.datum());
    graph0Datum.children.push(edgeData);

    insertAllElementsData(edge, edgeData);

    this._drawnEdge = null;

    return this

}

export function drawnEdgeSelection() {

  if (this._drawnEdge) {
    return this._drawnEdge.g;
  } else {
    return d3.select(null);
  }

}


function createEdge(attributes) {
    var attributesString = ''
    for (var name of Object.keys(attributes)) {
        if (attributes[name] != null) {
            attributesString += ' "' + name + '"="' + attributes[name] + '"';
        }
    }
    var dotSrc = 'digraph {a -> b [' + attributesString + ']}';
    var svgDoc = this.layoutSync(dotSrc, 'svg', 'dot');
    var parser = new window.DOMParser();
    var doc = parser.parseFromString(svgDoc, "image/svg+xml");
    var newDoc = d3.select(document.createDocumentFragment())
        .append(function() {
            return doc.documentElement;
        });
    var edge = newDoc.select('.edge');

    return edge;
}
