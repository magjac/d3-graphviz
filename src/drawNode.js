import Viz from "viz.js/viz";
import * as d3 from "d3-selection";
import {path as d3_path} from "d3-path";
import {rotate} from "./geometry";
import {extractAllElementsData} from "./element";
import {translatePointsAttribute} from "./svg";

var defaultNodeAttributes = {
    id: null,
    fillcolor: "none",
    color: "#000000",
    penwidth: 1,
    URL: null,
    tooltip: null,
    labeljust: "c",
    fontname: "Times,serif",
    fontsize: "14.00",
    fontcolor: "#000000",
};

var svgShapes = {
    ellipse: 'ellipse',
    oval: 'ellipse',
    circle: 'ellipse',
    point: 'ellipse',
    polygon: 'polygon',
    rect: 'polygon',
    box: 'polygon',
    egg: 'polygon',
    triangle: 'polygon',
    star: 'polygon',
}

function completeAttributes(attributes, defaultAttributes=defaultNodeAttributes) {
    for (var attribute in defaultAttributes) {
        if (attributes[attribute] === undefined) {
            attributes[attribute] = defaultAttributes[attribute];
        }
    }
}

export function drawNode(x, y, width, height, shape='ellipse', nodeId="", attributes, options={}) {
    attributes = attributes || {};
    if (shape == 'point' && !attributes.fillcolor) {
        attributes.fillcolor = '#000000';
    }
    completeAttributes(attributes);
    var root = this._selection;
    var svg = root.selectWithoutDataPropagation("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var newNode = graph0.append(function() {
        return createNode(shape, nodeId || '_', attributes).node();
    });
    newNode.attr('id', 'new1');
    newNode.datum(null);
    // remove direct child newline text nodes
    var newlines = d3.selectAll(newNode.node().childNodes).selectAll(function () {
        if (this.nodeName == '#text' && d3.select(this).text() == '\n') {
            return [this];
        } else {
            return [null];
        }
    });
    newlines.remove();
    // remove newline text nodes below children
    var allChildren = newNode.selectAll('*');
    var allTextNodes = allChildren.selectAll(function () {
        return this.childNodes;
    });
    var newlines = allTextNodes.selectAll(function () {
        if (this.nodeName == '#text' && d3.select(this).text() == '\n') {
            return [this];
        } else {
            return [null];
        }
    });
    newlines.remove();

    this._drawnNode = {
        g: newNode,
        nodeId: nodeId,
        shape: shape,
        x: x,
        y: y,
        width: width,
        height: height,
        attributes: attributes,
    };
    _updateNode(newNode, x, y, width, height, shape, nodeId, attributes, options);

    return this;
}

export function updateDrawnNode(x, y, width, height, nodeId, attributes, options={}) {
    if (!this._drawnNode)  {
        throw Error('No node has been drawn');
    }

    var node = this._drawnNode.g
    attributes = attributes || {};
    if (nodeId == null) {
        nodeId = this._drawnNode.nodeId;
    }
    completeAttributes(attributes, this._drawnNode.attributes);
    this._drawnNode.nodeId = nodeId;
    var shape = this._drawnNode.shape;
    this._drawnNode.x = x;
    this._drawnNode.y = y;
    this._drawnNode.width = width;
    this._drawnNode.height = height;
    this._drawnNode.attributes = attributes;
    _updateNode(node, x, y, width, height, shape, nodeId, attributes, options);

    return this;
}

function _updateNode(node, x, y, width, height, shape, nodeId, attributes, options) {

    if (shape == 'circle' || shape == 'point') {
        height = width
    }
    var id = attributes.id;
    var fill = attributes.fillcolor;
    var stroke = attributes.color;
    var strokeWidth = attributes.penwidth;
    if (attributes.labeljust == 'l') {
        var textAnchor = 'start';
    } else if (attributes.labeljust == 'r') {
        var textAnchor = 'end';
    } else {
        var textAnchor = 'middle';
    }
    var fontFamily = attributes.fontname;
    var fontSize = attributes.fontsize;
    var fontColor = attributes.fontcolor;

    var title = node.selectWithoutDataPropagation('title');
    if (attributes.URL || attributes.tooltip) {
        var subParent = node.selectWithoutDataPropagation("g").selectWithoutDataPropagation("a");
    } else {
        var subParent = node;
    }
    var svgShape = svgShapes[shape];
    var svgElement = subParent.selectWithoutDataPropagation(svgShape);

    node
        .attr("id", id);

    title.text(nodeId);
    var bbox = svgElement.node().getBBox();
    bbox.cx = bbox.x + bbox.width / 2;
    bbox.cy = bbox.y + bbox.height / 2;
    if (svgShape == 'ellipse') {
        svgElement
            .attr("cx", x)
            .attr("cy", y);
    } else {
        var pointsString = svgElement.attr('points');
        svgElement
            .attr("points", translatePointsAttribute(pointsString, x - bbox.cx, y - bbox.cy));
    }
    svgElement
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("strokeWidth", strokeWidth);

    if (shape != 'point') {
        var text = subParent.selectWithoutDataPropagation('text');

        text
            .attr("text-anchor", textAnchor)
            .attr("x", +text.attr("x") + x - bbox.cx)
            .attr("y", +text.attr("y") + y - bbox.cy)
            .attr("font-family", fontFamily)
            .attr("font-size", fontSize)
            .attr("fill", fontColor)
            .text(nodeId);
    }
    return this;
}

export function removeDrawnNode() {

    if (!this._drawnNode)  {
        return this;
    }

    var node = this._drawnNode.g;

    node.remove();

    this._drawnNode = null;

    return this
}

export function insertDrawnNode(nodeId) {

    if (!this._drawnNode)  {
        throw Error('No node has been drawn');
    }

    if (nodeId == null) {
        nodeId = this._drawnNode.nodeId;
    }
    var node = this._drawnNode.g;
    var attributes = this._drawnNode.attributes;
    var shape = this._drawnNode.shape;
    var svgShape = svgShapes[shape];

    var title = node.selectWithoutDataPropagation("title");
    title
        .text(nodeId);
    var titleText = title.selectAll(function() {
        return title.node().childNodes;
    });
    if (attributes.URL || attributes.tooltip) {
        var ga = node.selectWithoutDataPropagation("g");
        var a = ga.selectWithoutDataPropagation("a");
        var svgElement = a.selectWithoutDataPropagation(svgShape);
        var text = a.selectWithoutDataPropagation('text');
    } else {
        var svgElement = node.selectWithoutDataPropagation(svgShape);
        var text = node.selectWithoutDataPropagation('text');
    }
    text
        .text(nodeId);
    var textText = text.selectAll(function() {
        return text.node().childNodes;
    });

    var root = this._selection;
    var svg = root.selectWithoutDataPropagation("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var graph0Datum = graph0.datum();
    var nodeData = this._extractData(node, graph0Datum.children.length, graph0.datum());
    var gDatum = nodeData;
    var titleDatum = gDatum.children[0];
    var titleTextDatum = titleDatum.children[0];
    if (attributes.URL || attributes.tooltip) {
        var gaDatum = gDatum.children[1];
        var aDatum = gaDatum.children[0];
        var pathDatum = aDatum.children[0];
        var textDatum = aDatum.children[1];
    } else {
        var pathDatum = gDatum.children[1];
        var textDatum = gDatum.children[2];
    }
    if (shape != 'point') {
        var textTextDatum = textDatum.children[0];
    }

    graph0Datum.children.push(gDatum);

    node.datum(gDatum);
    node.data([gDatum], function (d) {
        return d.key;
    });

    title.datum(titleDatum);
    title.data([titleDatum], function (d) {
        return [d.key];
    });
    titleText.datum(titleTextDatum);
    titleText.data([titleTextDatum], function (d) {
        return [d.key];
    });

    if (attributes.URL || attributes.tooltip) {
        ga.datum(gaDatum);
        ga.data([gaDatum], function (d) {
            return [d.key];
        });

        a.datum(aDatum);
        a.data([aDatum], function (d) {
            return [d.key];
        });
    }

    svgElement.datum(pathDatum);
    svgElement.data([pathDatum], function (d) {
        return [d.key];
    });

    if (shape != 'point') {
        text.datum(textDatum);
        text.data([textDatum], function (d) {
            return [d.key];
        });

        textText.datum(textTextDatum);
        textText.data([textTextDatum], function (d) {
            return [d.key];
        });
    }
    return this

}

function createNode(shape, nodeId, attributes) {
    var attributesString = ''
    for (var name of Object.keys(attributes)) {
        if (attributes[name] != null) {
            attributesString += ' "' + name + '"="' + attributes[name] + '"';
        }
    }
    var dotSrc = 'graph {"' + nodeId + '" [shape=' + shape + attributesString + ']}';
    var svgDoc = Viz(dotSrc, {format: 'svg'});
    var parser = new window.DOMParser();
    var doc = parser.parseFromString(svgDoc, "image/svg+xml");
    var newDoc = d3.select(document.createDocumentFragment())
        .append(function() {
            return doc.documentElement;
        });
    var node = newDoc.select('.node');

    return node;
}
