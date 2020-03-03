import * as d3 from "d3-selection";
import {rotate} from "./geometry";
import {extractAllElementsData} from "./element";
import {translatePointsAttribute} from "./svg";
import {translateDAttribute} from "./svg";
import {insertAllElementsData} from "./element";
import {attributeElement} from "./element";
import {roundTo2Decimals} from "./utils";

export function drawNode(x, y, nodeId, attributes={}, options={}) {
    attributes = Object.assign({}, attributes);
    if (attributes.style && attributes.style.includes('invis')) {
        var newNode = d3.select(null);
    } else {
        var root = this._selection;
        var svg = root.selectWithoutDataPropagation("svg");
        var graph0 = svg.selectWithoutDataPropagation("g");
        var newNode0 = createNode.call(this, nodeId, attributes);
        var nodeData = extractAllElementsData(newNode0);
        var newNode = graph0.append('g')
            .data([nodeData]);
        attributeElement.call(newNode.node(), nodeData);
        _updateNode.call(this, newNode, x, y, nodeId, attributes, options);
    }
    this._drawnNode = {
        g: newNode,
        nodeId: nodeId,
        x: x,
        y: y,
        attributes: attributes,
    };

    return this;
}

export function updateDrawnNode(x, y, nodeId, attributes={}, options={}) {
    if (!this._drawnNode)  {
        throw Error('No node has been drawn');
    }

    var node = this._drawnNode.g
    if (nodeId == null) {
        nodeId = this._drawnNode.nodeId;
    }
    attributes = Object.assign(this._drawnNode.attributes, attributes);
    this._drawnNode.nodeId = nodeId;
    this._drawnNode.x = x;
    this._drawnNode.y = y;
    if (node.empty() && !(attributes.style && attributes.style.includes('invis'))) {
        var root = this._selection;
        var svg = root.selectWithoutDataPropagation("svg");
        var graph0 = svg.selectWithoutDataPropagation("g");
        var node = graph0.append('g');
        this._drawnNode.g = node;
    }
    if (!node.empty())  {
      _updateNode.call(this, node, x, y, nodeId, attributes, options);
    }

    return this;
}

function _updateNode(node, x, y, nodeId, attributes, options) {

    var newNode = createNode.call(this, nodeId, attributes);
    var nodeData = extractAllElementsData(newNode);
    node.data([nodeData]);
    attributeElement.call(node.node(), nodeData);
    _moveNode(node, x, y, attributes, options);

    return this;
}

function _moveNode(node, x, y, attributes, options) {
    if (attributes.URL || attributes.tooltip) {
        var subParent = node.selectWithoutDataPropagation("g").selectWithoutDataPropagation("a");
    } else {
        var subParent = node;
    }
    var svgElements = subParent.selectAll('ellipse,polygon,path,polyline');
    var text = node.selectWithoutDataPropagation("text");

    if (svgElements.size() != 0) {
        var bbox = svgElements.node().getBBox();
        bbox.cx = bbox.x + bbox.width / 2;
        bbox.cy = bbox.y + bbox.height / 2;
    } else if (text.size() != 0) {
        bbox = {
            x: +text.attr('x'),
            y: +text.attr('y'),
            width: 0,
            height: 0,
            cx: +text.attr('x'),
            cy: +text.attr('y'),
        }
    }
    svgElements.each(function(data, index) {
        var svgElement = d3.select(this);
        if (svgElement.attr("cx")) {
            svgElement
                .attr("cx", roundTo2Decimals(x))
                .attr("cy", roundTo2Decimals(y));
        } else if (svgElement.attr("points")) {
            var pointsString = svgElement.attr('points').trim();
            svgElement
                .attr("points", translatePointsAttribute(pointsString, x - bbox.cx, y - bbox.cy));
        } else {
            var d = svgElement.attr('d');
            svgElement
                .attr("d", translateDAttribute(d, x - bbox.cx, y - bbox.cy));
        }
    });

    if (text.size() != 0) {
        text
            .attr("x", roundTo2Decimals(+text.attr("x") + x - bbox.cx))
            .attr("y", roundTo2Decimals(+text.attr("y") + y - bbox.cy));
    }
    return this;
}

export function moveDrawnNode(x, y, options={}) {

    if (!this._drawnNode)  {
        throw Error('No node has been drawn');
    }
    var node = this._drawnNode.g;
    var attributes = this._drawnNode.attributes;

    this._drawnNode.x = x;
    this._drawnNode.y = y;

    if (!node.empty())  {
        _moveNode(node, x, y, attributes, options);
    }

    return this
}

export function removeDrawnNode() {

    if (!this._drawnNode)  {
        return this;
    }

    var node = this._drawnNode.g;

    if (!node.empty())  {
        node.remove();
    }

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
    if (node.empty())  {
        return this;
    }
    var attributes = this._drawnNode.attributes;

    var title = node.selectWithoutDataPropagation("title");
    title
        .text(nodeId);
    if (attributes.URL || attributes.tooltip) {
        var ga = node.selectWithoutDataPropagation("g");
        var a = ga.selectWithoutDataPropagation("a");
        var svgElement = a.selectWithoutDataPropagation('ellipse,polygon,path,polyline');
        var text = a.selectWithoutDataPropagation('text');
    } else {
        var svgElement = node.selectWithoutDataPropagation('ellipse,polygon,path,polyline');
        var text = node.selectWithoutDataPropagation('text');
    }
    text
        .text(attributes.label || nodeId);

    var root = this._selection;
    var svg = root.selectWithoutDataPropagation("svg");
    var graph0 = svg.selectWithoutDataPropagation("g");
    var graph0Datum = graph0.datum();
    var nodeData = this._extractData(node, graph0Datum.children.length, graph0.datum());
    graph0Datum.children.push(nodeData);

    insertAllElementsData(node, nodeData);

    this._drawnNode = null;

    return this

}

export function drawnNodeSelection() {

  if (this._drawnNode) {
    return this._drawnNode.g;
  } else {
    return d3.select(null);
  }

}

function createNode(nodeId, attributes) {
    var attributesString = ''
    for (var name of Object.keys(attributes)) {
        if (attributes[name] != null) {
            attributesString += ' "' + name + '"="' + attributes[name] + '"';
        }
    }
    var dotSrc = 'graph {"' + nodeId + '" [' + attributesString + ']}';
    var svgDoc = this.layoutSync(dotSrc, 'svg', 'dot');
    var parser = new window.DOMParser();
    var doc = parser.parseFromString(svgDoc, "image/svg+xml");
    var newDoc = d3.select(document.createDocumentFragment())
        .append(function() {
            return doc.documentElement;
        });
    var node = newDoc.select('.node');

    return node;
}
