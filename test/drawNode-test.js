var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");

tape("Check our understanding of how Graphviz draws nodes.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(endTest);

    function endTest() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');

        nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function(d) {
            return d.parent.key == 'a'
        });

        test.equal(nodeShape.attr("cx"), '27', 'cx of ellipse node');
        test.equal(nodeShape.attr("cy"), '-18', 'cy of ellipse node');
        test.equal(nodeShape.attr("rx"), '27', 'rx of ellipse node');
        test.equal(nodeShape.attr("ry"), '18', 'ry of ellipse node');

        test.end();
    }

});

tape("drawNode() draws a node in the same way as Graphviz does", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');

        graphviz
            .drawNode(0, -36, 54, 36, 'ellipse');

        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertDrawnNode('c');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function(d) {
            return d.parent.key == 'c'
        });

        test.equal(nodeShape.attr("cx"), '27', 'cx of ellipse node');
        test.equal(nodeShape.attr("cy"), '-18', 'cy of ellipse node');
        test.equal(nodeShape.attr("rx"), '27', 'rx of ellipse node');
        test.equal(nodeShape.attr("ry"), '18', 'ry of ellipse node');

        test.end();
    }

});

tape("drawNode() draws a polygon node", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; node [shape="polygon"]; a -> b;}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1 + num_nodes, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), 0, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');

        graphviz
            .drawNode(0, -36, 54, 36, 'polygon');

        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges + num_nodes, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertDrawnNode('c');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges + num_nodes, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        nodeShape = d3.selectAll('.node').selectAll('polygon').filter(function(d) {
            return d.parent.key == 'c'
        });

        test.equal(nodeShape.attr("points"), '54,-36 0,-36 0,0 54,0');

        test.end();
    }

});

tape("drawNode() draws a node with an URL attribute in the same way as Graphviz does", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b [URL="dummy"];}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        graphviz
            .drawNode(0, -36, 54, 36, 'ellipse', 'c', {URL: "dummy2"});
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        graphviz
            .insertDrawnNode('c');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn node');

        nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function(d) {
            return d.parent.parent.parent.key == 'c'
        });

        test.equal(nodeShape.attr("cx"), '27', 'cx of ellipse node');
        test.equal(nodeShape.attr("cy"), '-18', 'cy of ellipse node');
        test.equal(nodeShape.attr("rx"), '27', 'rx of ellipse node');
        test.equal(nodeShape.attr("ry"), '18', 'ry of ellipse node');

        test.end();
    }

});

tape("drawNode() draws a node with an tooltip attribute in the same way as Graphviz does", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b [tooltip="dummy"];}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial nodes');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        graphviz
            .drawNode(0, -36, 54, 36, 'ellipse', 'd', {tooltip: "dummy2"});
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        graphviz
            .insertDrawnNode('d');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn node');

        nodeShape = d3.selectAll('.node').selectAll('ellipse').filter(function(d) {
            return d.parent.parent.parent.key == 'd'
        });

        test.equal(nodeShape.attr("cx"), '27', 'cx of ellipse node');
        test.equal(nodeShape.attr("cy"), '-18', 'cy of ellipse node');
        test.equal(nodeShape.attr("rx"), '27', 'rx of ellipse node');
        test.equal(nodeShape.attr("ry"), '18', 'ry of ellipse node');

        test.end();
    }

});

tape("insertDrawnNode() inserts the currently drawn node into the joined data structure so that it can be animated when the graph is re-rendered", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        graphviz
            .drawNode(0, -36, 54, 36, 'ellipse', 'e', {URL: "dummy2"});
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        graphviz
            .insertDrawnNode();
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn node');
         test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn node');

        graphviz
            .dot('digraph {a -> b; e}')
            .render(endTest);
    }

    function endTest() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted node');
        test.end();
    }

});

tape("abortDrawingNode() removes the node currently being drawn", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        graphviz
            .drawNode(0, -36, 54, 36);
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');

        graphviz
            .abortDrawingNode();
        num_nodes -= 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after aborting drawing of the current node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after aborting drawing of the current node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons aborting drawing of the current node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses aborting drawing of the current node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after aborting drawing of the current node');

        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(endTest);
    }

    function endTest() {
        num_nodes = 2;
        num_edges = 2;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted node');
        test.end();
    }

});

tape("updateDrawnNode modifies the position, size and attributes of a node", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawNode);

    function drawNode() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        x = 20;
        y = -20;
        width = 40;
        height = 20;
        graphviz
            .drawNode(x, y, width, height, 'ellipse', 'f', {id: 'drawn-node'});
        num_nodes += 1;
        var node = d3.select('#drawn-node');
        test.equal(node.size(), 1, 'a node with the specified id attribute is present');
        var ellipse = node.selectWithoutDataPropagation("ellipse");
        var text = node.selectWithoutDataPropagation('text');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        test.equal(+ellipse.attr("cx"), x + width / 2, "The horizontal position of the ellipse center is updated");
        test.equal(+ellipse.attr("cy"), y + height / 2, "The vertical position of the ellipse center is updated");
        test.equal(+ellipse.attr("rx"), width / 2, "The horizontal radius of the ellipse is updated");
        test.equal(+ellipse.attr("ry"), height / 2, "The vertical radius of the ellipse is updated");
        test.equal(ellipse.attr("fill"), 'black', 'Default fill color of a drawn node ellipse is black');
        test.equal(ellipse.attr("stroke"), 'black', 'Default stroke color of a drawn node ellipse is black');
        test.equal(ellipse.attr("strokeWidth"), '1', 'Default stroke width is 1');

        x += 1;
        y -= 1;
        width += 1;
        height += 1;
        graphviz
            .updateDrawnNode(x, y, width, height, 'f', {fillcolor: "red", color: "purple", penwidth: 2, fontname:"Courier", fontsize:10, labeljust: 'l'});
        test.equal(+ellipse.attr("cx"), x + width / 2, "The horizontal position of the ellipse center is updated");
        test.equal(+ellipse.attr("cy"), y + height / 2, "The vertical position of the ellipse center is updated");
        test.equal(+ellipse.attr("rx"), width / 2, "The horizontal radius of the ellipse is updated");
        test.equal(+ellipse.attr("ry"), height / 2, "The vertical radius of the ellipse is updated");
        test.equal(ellipse.attr("fill"), 'red', 'Fill color of a drawn node is updated to red');
        test.equal(ellipse.attr("stroke"), 'purple', 'Stroke color is updated to purple');
        test.equal(ellipse.attr("strokeWidth"), '2', 'Stroke width is updated to 2');
        test.equal(text.attr("text-anchor"), 'start', 'text anchor is updated to start');
        test.equal(text.attr("font-family"), 'Courier', 'text font family is updated to Courier');
        test.equal(text.attr("font-size"), '10', 'text font size is updated to 10');

        x += 1;
        y -= 1;
        width += 1;
        height += 1;
        graphviz
            .updateDrawnNode(x, y, width, height, 'f', {color: "green", labeljust: 'r'});
        test.equal(+ellipse.attr("cx"), x + width / 2, "The horizontal position of the ellipse center is updated");
        test.equal(+ellipse.attr("cy"), y + height / 2, "The vertical position of the ellipse center is updated");
        test.equal(+ellipse.attr("rx"), width / 2, "The horizontal radius of the ellipse is updated");
        test.equal(+ellipse.attr("ry"), height / 2, "The vertical radius of the ellipse is updated");
        test.equal(ellipse.attr("fill"), 'red', 'Fill color is not updated when not specified');
        test.equal(ellipse.attr("stroke"), 'green', 'Stroke color is updated to green');
        test.equal(ellipse.attr("strokeWidth"), '2', 'Stroke width is not updated when not specified');
        test.equal(text.attr("text-anchor"), 'end', 'text anchor is updated to end');
        test.equal(text.attr("font-family"), 'Courier', 'text font family is not updated when not specified');
        test.equal(text.attr("font-size"), '10', 'text font size is not updated when not specified');

        x += 1;
        y -= 1;
        width += 1;
        height += 1;
        graphviz
            .updateDrawnNode(x, y, width, height);
        test.equal(+ellipse.attr("cx"), x + width / 2, "The horizontal position of the ellipse center is updated");
        test.equal(+ellipse.attr("cy"), y + height / 2, "The vertical position of the ellipse center is updated");
        test.equal(+ellipse.attr("rx"), width / 2, "The horizontal radius of the ellipse is updated");
        test.equal(+ellipse.attr("ry"), height / 2, "The vertical radius of the ellipse is updated");
        test.equal(ellipse.attr("fill"), 'red', 'Fill color is not updated when no attribute is given');
        test.equal(ellipse.attr("stroke"), 'green', 'Stroke color is updated  when no attribute is given');
        test.equal(ellipse.attr("strokeWidth"), '2', 'Stroke width is not updated  when no attribute is given');

        test.end();
    }

});
