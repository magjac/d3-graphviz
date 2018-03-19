import * as d3 from "d3-selection";
import {path as d3_path} from "d3-path";
import {rotate} from "./geometry";

var defaultEdgeAttributes = {
    id: null,
    fill: "black",
    stroke: "black",
    strokeWidth: 1,
    href: null,
};

function completeAttributes(attributes, defaultAttributes=defaultEdgeAttributes) {
    for (var attribute in defaultAttributes) {
        if (attributes[attribute] === undefined) {
            attributes[attribute] = defaultAttributes[attribute];
        }
    }
}

export function drawEdge(x1, y1, x2, y2, shortening=0, attributes) {
    attributes = attributes || {};
    completeAttributes(attributes);
    var svg = d3.select("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var newEdge = graph0.append("g")
        .attr("class", "edge");
    var title = newEdge.insert('title', ':first-child')
        .text("");
    var a = newEdge.append("g").append("a");
    var line = a.append("path");
    var arrowHead = a.append("polygon");
    this._currentEdge = {
        g: newEdge,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        attributes: attributes,
    };
    _updateEdge(newEdge, x1, y1, x2, y2, shortening, attributes);

    return this;
}

export function updateCurrentEdge(x1, y1, x2, y2, shortening=0, attributes) {
    var edge = this._currentEdge.g
    attributes = attributes || {};
    completeAttributes(attributes, this._currentEdge.attributes);
    this._currentEdge.x1 = x1;
    this._currentEdge.y1 = y1;
    this._currentEdge.x2 = x2;
    this._currentEdge.y2 = y2;
    this._currentEdge.attributes = attributes;
    _updateEdge(edge, x1, y1, x2, y2, shortening, attributes);

    return this;
}

function _updateEdge(edge, x1, y1, x2, y2, shortening, attributes) {

    var id = attributes.id;
    var fill = attributes.fill;
    var stroke = attributes.stroke;
    var strokeWidth = attributes.strokeWidth;

    var arrowHeadLength = 10;
    var arrowHeadWidth = 7;
    var margin = 0.174;

    var arrowHeadPoints = [
        [0, -arrowHeadWidth / 2],
        [arrowHeadLength, 0],
        [0, arrowHeadWidth / 2],
        [0, -arrowHeadWidth / 2],
    ];

    var dx = x2 - x1;
    var dy = y2 - y1;
    var length = Math.sqrt(dx * dx + dy * dy);
    var cosA = dx / length;
    var sinA = dy / length;
    x2 = x1 + (length - shortening - arrowHeadLength - margin) * cosA;
    y2 = y1 + (length - shortening - arrowHeadLength - margin) * sinA;

    var a = edge.selectWithoutDataPropagation("g").selectWithoutDataPropagation("a");
    var line = a.selectWithoutDataPropagation("path");
    var arrowHead = a.selectWithoutDataPropagation("polygon");

    edge
        .attr("id", id);

    var path1 = d3_path();
    path1.moveTo(x1, y1);
    path1.lineTo(x2, y2);

    line
        .attr("d", path1)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("strokeWidth", strokeWidth);

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
        .attr("points", pointsAttr)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("strokeWidth", strokeWidth);

    return this;
}

export function moveCurrentEdgeEndPoint(x2, y2, shortening=0) {

    var edge = this._currentEdge.g;
    var x1 = this._currentEdge.x1;
    var y1 = this._currentEdge.y1;
    var attributes = this._currentEdge.attributes;

    this._currentEdge.x2 = x2;
    this._currentEdge.y2 = y2;
    _updateEdge(edge, x1, y1, x2, y2, shortening, attributes);

    return this
}

export function abortDrawing() {

    var edge = this._currentEdge.g;

    edge.remove();

    this._currentEdge = null;

    return this
}

export function insertCurrentEdge(name) {

    var edge = this._currentEdge.g;

    var title = edge.selectWithoutDataPropagation("title");
    title
        .text(name);
    var text = title.selectAll(function() {
        return title.node().childNodes;
    });
    var ga = edge.selectWithoutDataPropagation("g");
    var a = ga.selectWithoutDataPropagation("a");
    var line = a.selectWithoutDataPropagation("path");
    var arrowHead = a.selectWithoutDataPropagation("polygon");

    var graph0 = d3.select("svg").selectWithoutDataPropagation("g");
    var graph0Datum = graph0.datum();
    var edgeData = this._extractData(edge, graph0Datum.children.length, graph0.datum());
    var gDatum = edgeData;
    var titleDatum = gDatum.children[0];
    var textDatum = titleDatum.children[0];
    var gaDatum = gDatum.children[1];
    var aDatum = gaDatum.children[0];
    var pathDatum = aDatum.children[0];
    var polygonDatum = aDatum.children[1];
    graph0Datum.children.push(gDatum);

    edge.datum(gDatum);
    edge.data([gDatum], function (d) {
        return d.key;
    });

    title.datum(titleDatum);
    title.data([titleDatum], function (d) {
        return [d.key];
    });

    text.datum(textDatum);
    text.data([textDatum], function (d) {
        return [d.key];
    });

    ga.datum(gaDatum);
    ga.data([gaDatum], function (d) {
        return [d.key];
    });

    a.datum(aDatum);
    a.data([aDatum], function (d) {
        return [d.key];
    });

    line.datum(pathDatum);
    line.data([pathDatum], function (d) {
        return [d.key];
    });

    arrowHead.datum(polygonDatum);
    arrowHead.data([polygonDatum], function (d) {
        return [d.key];
    });

    return this

}
