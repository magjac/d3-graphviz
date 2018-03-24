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
            .drawNode(0, -36, 54, 36, 'c', 'ellipse');

        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing an edge');
        graphviz
            .insertCurrentNode('c');
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
            .drawNode(0, -36, 54, 36, 'c', 'ellipse', {URL: "dummy2"});
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        graphviz
            .insertCurrentNode('c');
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
            .drawNode(0, -36, 54, 36, 'd', 'ellipse', {tooltip: "dummy2"});
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        graphviz
            .insertCurrentNode('d');
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

tape("insertCurrentNode() inserts the currently drawn node into the joined data structure so that it can be animated when the graph is re-rendered", function(test) {
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
            .drawNode(0, -36, 54, 36, 'e', 'ellipse', {URL: "dummy2"});
        num_nodes += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing a node');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing a node');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing a node');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing a node');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing a node');
        graphviz
            .insertCurrentNode('e');
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
