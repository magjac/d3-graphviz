import * as d3 from "d3-selection";
import {path as d3_path} from "d3-path";
import {rotate} from "./geometry";

function completeAttributes(attributes) {

    var defaultEdgeAttributes = {
        fill: "black",
        stroke: "black",
        strokeWidth: 1,
        href: null,
    };
    for (var attribute in defaultEdgeAttributes) {
        if (attributes[attribute] === undefined) {
            attributes[attribute] = defaultEdgeAttributes[attribute];
        }
    }
}

export function drawEdge(x1, y1, x2, y2, attributes) {
    attributes = attributes || {};
    completeAttributes(attributes);
    var svg = d3.select("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var newEdge = graph0.append("g")
        .attr("class", "edge");
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
    _updateEdge(newEdge, x1, y1, x2, y2, attributes);

    return this;
}

export function updateEdge(edge, x1, y1, x2, y2, attributes) {
    attributes = attributes || {};
    completeAttributes(attributes);
    _updateEdge(edge, x1, y1, x2, y2, attributes);
}

function _updateEdge(edge, x1, y1, x2, y2, attributes) {

    var fill = attributes.fill;
    var stroke = attributes.stroke;
    var strokeWidth = attributes.strokeWidth;

    var shortening = 2; // avoid mouse pointing on edge

    var arrowHeadPoints = [
        [0, -3.5],
        [10, 0],
        [0, 3.5],
        [0, -3.5],
    ];

    var dx = x2 - x1;
    var dy = y2 - y1;
    var length = Math.sqrt(dx * dx + dy * dy);
    var cosA = dx / length;
    var sinA = dy / length;
    x2 = x1 + (length - shortening) * cosA;
    y2 = y1 + (length - shortening) * sinA;

    var a = edge.selectWithoutDataPropagation("g").selectWithoutDataPropagation("a");
    var line = a.selectWithoutDataPropagation("path");
    var arrowHead = a.selectWithoutDataPropagation("polygon");

    var path1 = d3_path();
    path1.moveTo(x1, y1);
    path1.lineTo(x2, y2);

    line
        .attr("d", path1)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("strokeWidth", strokeWidth);

    var xpoints = arrowHeadPoints.map(function (points) {
        return points[0];
    });
    var xmax = Math.max(...xpoints);
    for (var i = 0; i < arrowHeadPoints.length; i++) {
        var point = arrowHeadPoints[i];
        arrowHeadPoints[i] = rotate(point[0] - xmax, point[1], cosA, sinA);
    }
    for (var i = 0; i < arrowHeadPoints.length; i++) {
        var point = arrowHeadPoints[i];
        arrowHeadPoints[i] = [x2 + point[0], y2 + point[1]];
    }
    var allPoints = [];
    for (var i = 0; i < arrowHeadPoints.length; i++) {
        var point = arrowHeadPoints[i];
        allPoints.push(point[0]);
        allPoints.push(point[1]);
    }
    var pointsAttr = allPoints.join(',');

    arrowHead
        .attr("points", pointsAttr)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("strokeWidth", strokeWidth);

    return this;
}

export function moveCurrentEdgeEndPoint(x2, y2) {

    var edge = this._currentEdge.g;
    var x1 = this._currentEdge.x1;
    var y1 = this._currentEdge.y1;
    var attributes = this._currentEdge.attributes;

    _updateEdge(edge, x1, y1, x2, y2, attributes);

    return this
}

export function abortDrawing() {

    var edge = this._currentEdge.g;

    edge.remove();

    this._currentEdge = null;

    return this
}
