import * as d3 from "d3-selection";
import {path as d3_path} from "d3-path";
import {rotate} from "./geometry";

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
    var newNode = graph0.append("g")
        .datum(null)
        .attr("class", "node");
    var title = newNode.append('title')
        .text("");
    var svgShape = svgShapes[shape];
    if (!svgShape) {
        throw Error('Usupported shape: ' + shape);
    }
    if (attributes.URL || attributes.tooltip) {
        var a = newNode.append("g").append("a");
        if (attributes.URL) {
            a.attr("href", attributes.URL);
        }
        if (attributes.tooltip) {
            a.attr('title', attributes.tooltip);
        }
        var svgElement = a.append(svgShape);
        var text = a.append('text');
    } else {
        var svgElement = newNode.append(svgShape);
        var text = newNode.append('text')
            .text("");
    }

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
    if (svgShape == 'ellipse') {
        svgElement
            .attr("cx", x + width / 2)
            .attr("cy", y + height/ 2)
            .attr("rx", width / 2)
            .attr("ry", height / 2)
    } else {
        if (shape == 'egg') {
            svgElement
                .attr("points", '31.426,-.0493 33.202,-.1479 34.9597,-.2953 36.6919,-.4913 38.3915,-.7353 40.0517,-1.0266 41.666,-1.3645 43.2281,-1.7479 44.732,-2.1759 46.1722,-2.6472 47.5435,-3.1606 48.8411,-3.7147 50.0607,-4.308 51.1984,-4.9388 52.2508,-5.6054 53.2152,-6.3059 54.089,-7.0385 54.8704,-7.8012 55.558,-8.5918 56.151,-9.4082 56.6489,-10.2481 57.052,-11.1093 57.3606,-11.9894 57.5759,-12.886 57.6992,-13.7965 57.7324,-14.7186 57.6776,-15.6497 57.5374,-16.5873 57.3145,-17.5287 57.0121,-18.4713 56.6334,-19.4127 56.182,-20.3503 55.6616,-21.2814 55.0759,-22.2035 54.4287,-23.114 53.7241,-24.0106 52.966,-24.8907 52.1582,-25.7519 51.3048,-26.5918 50.4093,-27.4082 49.4757,-28.1988 48.5074,-28.9615 47.5078,-29.6941 46.4803,-30.3946 45.4278,-31.0612 44.3533,-31.692 43.2595,-32.2853 42.1488,-32.8394 41.0235,-33.3528 39.8858,-33.8241 38.7373,-34.2521 37.58,-34.6355 36.4152,-34.9734 35.2443,-35.2647 34.0685,-35.5087 32.8889,-35.7047 31.7065,-35.8521 30.522,-35.9507 29.3364,-36 28.1505,-36 26.9649,-35.9507 25.7804,-35.8521 24.598,-35.7047 23.4184,-35.5087 22.2426,-35.2647 21.0717,-34.9734 19.9069,-34.6355 18.7495,-34.2521 17.6011,-33.8241 16.4633,-33.3528 15.3381,-32.8394 14.2274,-32.2853 13.1335,-31.692 12.0591,-31.0612 11.0066,-30.3946 9.9791,-29.6941 8.9795,-28.9615 8.0112,-28.1988 7.0775,-27.4082 6.1821,-26.5918 5.3286,-25.7519 4.5209,-24.8907 3.7628,-24.0106 3.0582,-23.114 2.411,-22.2035 1.8253,-21.2814 1.3048,-20.3503 .8534,-19.4127 .4748,-18.4713 .1724,-17.5287 -.0505,-16.5873 -.1907,-15.6497 -.2455,-14.7186 -.2123,-13.7965 -.089,-12.886 .1263,-11.9894 .4349,-11.1093 .8379,-10.2481 1.3359,-9.4082 1.9289,-8.5918 2.6165,-7.8012 3.3979,-7.0385 4.2717,-6.3059 5.2361,-5.6054 6.2885,-4.9388 7.4262,-4.308 8.6458,-3.7147 9.9434,-3.1606 11.3147,-2.6472 12.7549,-2.1759 14.2588,-1.7479 15.8209,-1.3645 17.4352,-1.0266 19.0954,-.7353 20.795,-.4913 22.5271,-.2953 24.2848,-.1479 26.0609,-.0493 27.848,0 29.6389,0 31.426,-.0493');
        } else {
            svgElement
                .attr("points", '' + (x + width) + ',' + y + ' ' + x + ',' + y + ' ' + x + ',' + (y + height) + ' ' + (x + width) + ',' + (y + height) + ' ' + (x + width) + ',' + y)
        }
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
