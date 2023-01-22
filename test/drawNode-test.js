import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import {translatePointsAttribute} from "../src/svg.js";

it("Check our understanding of how Graphviz draws nodes.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');

    const nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function (d) {
        return d.parent.key == 'a'
    });

    assert.equal(nodeShape.attr("cx"), '27', 'cx of ellipse node');
    assert.equal(nodeShape.attr("cy"), '-18', 'cy of ellipse node');
    assert.equal(nodeShape.attr("rx"), '27', 'rx of ellipse node');
    assert.equal(nodeShape.attr("ry"), '18', 'ry of ellipse node');

});

it("drawNode() draws a node in the same way as Graphviz does", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');

    var x = 100;
    var y = -100
    graphviz
        .drawNode(x, y, '', { shape: 'ellipse' });

    num_nodes += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    graphviz
        .insertDrawnNode('c');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

    const nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function (d) {
        return d.parent.key == 'c'
    });

    assert.equal(+nodeShape.attr("cx"), x, 'cx of ellipse node');
    assert.equal(+nodeShape.attr("cy"), y, 'cy of ellipse node');
    assert.equal(+nodeShape.attr("rx"), 27, 'rx of ellipse node');
    assert.equal(+nodeShape.attr("ry"), 18, 'ry of ellipse node');

});

it("drawNode() draws a polygon node", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; node [shape="polygon"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1 + num_nodes, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), 0, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');

    var x = 100;
    var y = -100
    graphviz
        .drawNode(x, y, '', { shape: 'polygon' });

    num_nodes += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges + num_nodes, 'Number of polygons after drawing an edge');
    assert.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after drawing an edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
    graphviz
        .insertDrawnNode('c');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges + num_nodes, 'Number of polygons after inserting the currently drawn edge');
    assert.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after inserting the currently drawn edge');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

    const nodeShape = d3.selectAll('.node').selectAll('polygon').filter(function (d) {
        return d.parent.key == 'c'
    });

    var expectedPoints = translatePointsAttribute('27,-18 -27,-18 -27,18 27,18 27,-18', x, y);
    assert.equal(nodeShape.attr("points"), expectedPoints, 'points of polygon');

});

it("drawNode() draws a node with an URL attribute in the same way as Graphviz does", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b [URL="dummy"];}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    var x = 100;
    var y = -100
    graphviz
        .drawNode(x, y, 'c', { shape: 'ellipse', URL: "dummy2" });
    num_nodes += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
    graphviz
        .insertDrawnNode('c');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn node');

    const nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function (d) {
        return d.parent.parent.parent.key == 'c'
    });

    assert.equal(+nodeShape.attr("cx"), x, 'cx of ellipse node');
    assert.equal(+nodeShape.attr("cy"), y, 'cy of ellipse node');
    assert.equal(+nodeShape.attr("rx"), 27, 'rx of ellipse node');
    assert.equal(+nodeShape.attr("ry"), 18, 'ry of ellipse node');


});

it("drawNode() draws a node with an tooltip attribute in the same way as Graphviz does", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b [tooltip="dummy"];}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial nodes');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    var x = 100;
    var y = -100
    graphviz
        .drawNode(x, y, 'd', { shape: 'ellipse', tooltip: "dummy2" });
    num_nodes += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
    graphviz
        .insertDrawnNode('d');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn node');

    const nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function (d) {
        return d.parent.parent.parent.key == 'd'
    });

    assert.equal(+nodeShape.attr("cx"), x, 'cx of ellipse node');
    assert.equal(+nodeShape.attr("cy"), y, 'cy of ellipse node');
    assert.equal(+nodeShape.attr("rx"), 27, 'rx of ellipse node');
    assert.equal(+nodeShape.attr("ry"), 18, 'ry of ellipse node');

});

it("insertDrawnNode() inserts the currently drawn node into the joined data structure so that it can be animated when the graph is re-rendered", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    graphviz
        .drawNode(0, -36, 'e', { shape: 'ellipse', URL: "dummy2" });
    num_nodes += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
    graphviz
        .insertDrawnNode();
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn node');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; e}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted node');

});

it("removeDrawnNode() removes the node currently being drawn", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    graphviz
        .drawNode(0, -36);
    num_nodes += 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');

    graphviz
        .removeDrawnNode();
    num_nodes -= 1;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after aborting drawing of the current node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after aborting drawing of the current node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons aborting drawing of the current node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses aborting drawing of the current node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after aborting drawing of the current node');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(resolve);
    });

    num_nodes = 2;
    num_edges = 2;
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted node');

});

it("updateDrawnNode modifies the position, size and attributes of a node", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    let x = 20;
    let y = -20;
    graphviz
        .drawNode(x, y, 'f', { shape: 'ellipse', id: 'drawn-node' });
    num_nodes += 1;
    var node = d3.select('#drawn-node');
    assert.equal(node.size(), 1, 'a node with the specified id attribute is present');
    var ellipse = node.selectWithoutDataPropagation("ellipse");
    var text = node.selectWithoutDataPropagation('text');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");
    assert.equal(ellipse.attr("fill"), 'none', 'Default fill color of a drawn node ellipse is none');
    assert.equal(ellipse.attr("stroke"), 'black', 'Default stroke color of a drawn node ellipse is black');
    assert.equal(ellipse.attr("stroke-width"), null, 'Default is to not set stroke width');

    x += 1;
    y -= 1;
    graphviz
        .updateDrawnNode(x, y, 'f', { style: 'filled', fillcolor: "red", color: "purple", penwidth: 2, fontname: "Courier", fontsize: 10, fontcolor: "red" });
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");
    assert.equal(ellipse.attr("fill"), 'red', 'Fill color of a drawn node is updated to red');
    assert.equal(ellipse.attr("stroke"), 'purple', 'Stroke color is updated to purple');
    assert.equal(ellipse.attr("stroke-width"), '2', 'Stroke width is updated to 2');
    assert.equal(text.attr("font-family"), 'Courier,monospace', 'text font family is updated to Courier');
    assert.equal(text.attr("font-size"), '10.00', 'text font size is updated to 10');
    assert.equal(text.attr("fill"), 'red', 'text font color is updated to red');

    x += 1;
    y -= 1;
    graphviz
        .updateDrawnNode(x, y, 'f', { color: "green" });
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");
    assert.equal(ellipse.attr("fill"), 'red', 'Fill color is not updated when not specified');
    assert.equal(ellipse.attr("stroke"), 'green', 'Stroke color is updated to green');
    assert.equal(ellipse.attr("stroke-width"), '2', 'Stroke width is not updated when not specified');
    assert.equal(text.attr("font-family"), 'Courier,monospace', 'text font family is not updated when not specified');
    assert.equal(text.attr("font-size"), '10.00', 'text font size is not updated when not specified');

    x += 1;
    y -= 1;
    graphviz
        .updateDrawnNode(x, y, 'f', { color: "green" });
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");
    assert.equal(ellipse.attr("fill"), 'red', 'Fill color is not updated when not specified');
    assert.equal(ellipse.attr("stroke"), 'green', 'Stroke color is updated to green');
    assert.equal(ellipse.attr("stroke-width"), '2', 'Stroke width is not updated when not specified');
    assert.equal(text.attr("text-anchor"), 'middle', 'text anchor is updated to middle');
    assert.equal(text.attr("font-family"), 'Courier,monospace', 'text font family is not updated when not specified');
    assert.equal(text.attr("font-size"), '10.00', 'text font size is not updated when not specified');

    x += 1;
    y -= 1;
    graphviz
        .updateDrawnNode(x, y);
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");
    assert.equal(ellipse.attr("fill"), 'red', 'Fill color is not updated when no attribute is given');
    assert.equal(ellipse.attr("stroke"), 'green', 'Stroke color is updated  when no attribute is given');
    assert.equal(ellipse.attr("stroke-width"), '2', 'Stroke width is not updated  when no attribute is given');

    graphviz
        .updateDrawnNode(x, y, 'f', { shape: "box" });
    var node = d3.select('#drawn-node');
    var ellipse = node.selectWithoutDataPropagation("ellipse");
    var polygon = node.selectWithoutDataPropagation("polygon");
    assert.equal(ellipse.size(), 0, 'Number of ellipses in node after changing node shape');
    assert.equal(polygon.size(), 1, 'Number of polygons in node after changing node shape');
    assert.equal(polygon.attr("cx"), null, "The polygon does not have the cx attribute from the ellipse");
    assert.equal(polygon.attr("cy"), null, "The polygon does not have the cy attribute from the ellipse");
    assert.notEqual(polygon.attr("points"), null, "The polygon has a points attribute");
    assert.equal(polygon.attr("points").split(' ')
        .reduce((acc, v) => [Math.min(acc[0], v.split(',')[0]), Math.max(acc[1], v.split(',')[0])], [Number.MAX_VALUE, -Number.MAX_VALUE])
        .reduce((sum, x) => sum + x, 0) / 2, x, "The center x value of the polygon is updated");
    assert.equal(polygon.attr("points").split(' ')
        .reduce((acc, v) => [Math.min(acc[0], v.split(',')[1]), Math.max(acc[1], v.split(',')[1])], [Number.MAX_VALUE, -Number.MAX_VALUE])
        .reduce((sum, y) => sum + y, 0) / 2, y, "The center y value of the polygon is updated");
    assert.equal(polygon.attr("fill"), 'red', 'Fill color is not updated when not specified');
    assert.equal(polygon.attr("stroke"), 'green', 'Stroke color is updated to green');
    assert.equal(polygon.attr("stroke-width"), '2', 'Stroke width is not updated when not specified');
    assert.equal(text.attr("text-anchor"), 'middle', 'text anchor is updated to middle');
    assert.equal(text.attr("font-family"), 'Courier,monospace', 'text font family is not updated when not specified');
    assert.equal(text.attr("font-size"), '10.00', 'text font size is not updated when not specified');

    graphviz
        .updateDrawnNode(x, y, 'f', { color: null, fillcolor: null, penwidth: null });
    assert.equal(polygon.attr("fill"), 'lightgrey', 'Fill color is lightgray when fillcolor is removed');
    assert.equal(polygon.attr("stroke"), 'black', 'Stroke color is black when color is removed');
    assert.equal(polygon.attr("stroke-width"), null, 'Stroke width is removed when removed');
    assert.equal(text.attr("text-anchor"), 'middle', 'text anchor is updated to middle');
    assert.equal(text.attr("font-family"), 'Courier,monospace', 'text font family is not updated when not specified');
    assert.equal(text.attr("font-size"), '10.00', 'text font size is not updated when not specified');

});

it("moveDrawnNode modifies the position of a node", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    let x = 20;
    let y = -20;
    graphviz
        .drawNode(x, y, 'f', { shape: 'ellipse', id: 'drawn-node' });
    num_nodes += 1;
    var node = d3.select('#drawn-node');
    assert.equal(node.size(), 1, 'a node with the specified id attribute is present');
    var ellipse = node.selectWithoutDataPropagation("ellipse");
    var text = node.selectWithoutDataPropagation('text');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");

    x += 1;
    y -= 1;
    graphviz
        .moveDrawnNode(x, y);
    assert.equal(+ellipse.attr("cx"), x, "The horizontal position of the ellipse center is updated");
    assert.equal(+ellipse.attr("cy"), y, "The vertical position of the ellipse center is updated");

});

it("drawnNodeSelection return a selection containing the node currently being drawn", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    let x = 20;
    let y = -20;

    var noDrawnNode = graphviz.drawnNodeSelection();
    assert.ok(noDrawnNode.empty(), "drawnNodeSelection() returns an empty selection when no node is currently being drawn");

    graphviz
        .drawNode(x, y, 'f', { shape: 'ellipse', id: 'drawn-node' });
    num_nodes += 1;
    var node = d3.select('#drawn-node');
    assert.equal(node.size(), 1, 'a node with the specified id attribute is present');
    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
    assert.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');

    var drawnNode = graphviz.drawnNodeSelection();
    assert.equal(drawnNode.node(), node.node(), "drawnNodeSelection() returns the node currently being drawn");
    graphviz
        .insertDrawnNode();
    var insertedDrawnNode = graphviz.drawnNodeSelection();
    assert.ok(insertedDrawnNode.empty(), "drawnNodeSelection() returns an empty selection when the drawn node has been inserted into the data");

});

it("Attempts to operate on a node without drawing one first is handled gracefully", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var num_nodes = 2;
    var num_edges = 1;

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .dot('digraph {graph [rankdir="LR"]; a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
    assert.throws(function () {
        graphviz
            .updateDrawnNode(21, -21);
    }, "updateDrawnNode throws error if no node has been drawn first");
    assert.throws(function () {
        graphviz
            .moveDrawnNode(21, -21);
    }, "moveDrawnNode throws error if no node has been drawn first");
    assert.throws(function () {
        graphviz
            .insertDrawnNode('b->a');
    }, "insertDrawnNode throws error if no node has been drawn first");

    assert.doesNotThrow(function () {
        graphviz
            .removeDrawnNode();
    }, "removeDrawnNode is ignored if no node has been drawn first");

});
