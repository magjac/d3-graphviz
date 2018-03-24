import * as d3 from "d3-selection";
import {path as d3_path} from "d3-path";
import {rotate} from "./geometry";

var defaultNodeAttributes = {
    id: null,
    fillcolor: "black",
    color: "black",
    penwidth: 1,
    URL: null,
    tooltip: null,
    labeljust: "c",
    fontname: "Times,serif",
    fontsize: 14,
    fontcolor: "black",
};

var svgShapes = {
    ellipse: 'ellipse',
    circle: 'ellipse',
    polygon: 'polygon',
    rect: 'polygon',
    box: 'polygon',
}

function completeAttributes(attributes, defaultAttributes=defaultNodeAttributes) {
    for (var attribute in defaultAttributes) {
        if (attributes[attribute] === undefined) {
            attributes[attribute] = defaultAttributes[attribute];
        }
    }
}

export function drawNode(x, y, width, height, nodeId, shape='ellipse', attributes, options={}) {
    attributes = attributes || {};
    completeAttributes(attributes);
    var svg = d3.select("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var newNode = graph0.append("g")
        .datum(null)
        .attr("class", "node");
    var title = newNode.append('title')
        .text("");
    if (attributes.URL || attributes.tooltip) {
        var a = newNode.append("g").append("a");
        if (attributes.URL) {
            a.attr("href", attributes.URL);
        }
        if (attributes.tooltip) {
            a.attr('title', attributes.tooltip);
        }
        var svgShape = a.append(shape);
        var text = a.append('text');
    } else {
        var svgShape = newNode.append(shape);
        var text = newNode.append('text')
            .text("");
    }

    this._currentNode = {
        g: newNode,
        nodeId: nodeId,
        shape: shape,
        x: x,
        y: y,
        width: width,
        height: height,
        attributes: attributes,
    };
    _updateNode(newNode, x, y, width, height, nodeId, shape, attributes, options);

    return this;
}

export function updateCurrentNode(x, y, width, height, nodeId, attributes, options={}) {
    var node = this._currentNode.g
    attributes = attributes || {};
    completeAttributes(attributes, this._currentNode.attributes);
    this._currentNode.nodeId = nodeId;
    var shape = this._currentNode.shape;
    this._currentNode.x = x;
    this._currentNode.y = y;
    this._currentNode.width = width;
    this._currentNode.height = height;
    this._currentNode.attributes = attributes;
    _updateNode(node, x, y, width, height, nodeId, shape, attributes, options);

    return this;
}

function _updateNode(node, x, y, width, height, nodeId, shape, attributes, options) {

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
    var svgElement = subParent.selectWithoutDataPropagation(shape);

    node
        .attr("id", id);

    title.text(nodeId);
    var svgShape = svgShapes[shape];
    if (svgShape == 'ellipse') {
        svgElement
            .attr("cx", x + width / 2)
            .attr("cy", y + height/ 2)
            .attr("rx", width / 2)
            .attr("ry", height / 2)
    } else {
        svgElement
            .attr("points", '' + (x + width) + ',' + y + ' ' + x + ',' + y + ' ' + x + ',' + (y + height) + ' ' + (x + width) + ',' + (y + height))
    }
    svgElement
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("strokeWidth", strokeWidth);

    var text = subParent.selectWithoutDataPropagation('text');

    text
        .attr("text-anchor", textAnchor)
        .attr("x", x + width / 2)
        .attr("y", y + height - fontSize)
        .attr("font-family", fontFamily)
        .attr("font-size", fontSize)
        .attr("fill", fontColor)
        .text(nodeId);
    return this;
}

export function abortDrawingNode() {

    var node = this._currentNode.g;

    node.remove();

    this._currentNode = null;

    return this
}

export function insertCurrentNode(nodeId) {

    var node = this._currentNode.g;
    var attributes = this._currentNode.attributes;
    var shape = this._currentNode.shape;
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
    var textText = text.selectAll(function() {
        return text.node().childNodes;
    });

    var graph0 = d3.select("svg").selectWithoutDataPropagation("g");
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
    var textTextDatum = textDatum.children[0];

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

    text.datum(textDatum);
    text.data([textDatum], function (d) {
        return [d.key];
    });

    textText.datum(textTextDatum);
    textText.data([textTextDatum], function (d) {
        return [d.key];
    });

    return this

}
