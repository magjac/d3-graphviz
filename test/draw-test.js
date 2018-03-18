var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");

tape("drawEdge and moveCurrentEdgeEndPoint draws and modifies an edge", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var num_nodes = 2;
    var num_edges = 1;

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {graph [rankdir="LR"]; a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), num_edges + 1, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of initial paths');
        x1 = 20;
        y1 = -20;
        x2 = 40;
        y2 = -20;
        graphviz
            .drawEdge(x1, y1, x2, y2);
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing an edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing an edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing an edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing an edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing 5 edge');
        graphviz
            .insertCurrentEdge('b -> a');
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');

        newArrowHead = d3.selectAll('.edge').selectAll('polygon').filter(function(d) {
            return d.parent.parent.parent.key == 'b -> a'
        });
        points = newArrowHead.attr("points").split(',').map(function(v) {
            return +v;
        });
        var actual_x = [];
        var actual_y = [];
        for (i = 0; i < points.length; i += 2) {
            actual_x.push(points[i]);
            actual_y.push(points[i + 1]);
        }
        arrowHeadLength = 10;
        arrowHeadWidth = 7;
        margin = 2;
        var expected_x = [];
        var expected_y = [];
        expected_x.push(x2 - arrowHeadLength - margin);
        expected_y.push(y2 - arrowHeadWidth / 2);
        expected_x.push(x2 - margin);
        expected_y.push(y2);
        expected_x.push(x2 - arrowHeadLength - margin);
        expected_y.push(y2 + arrowHeadWidth / 2);
        expected_x.push(x2 - arrowHeadLength - margin);
        expected_y.push(y2 - arrowHeadWidth / 2);
        for (i = 0; i < expected_x.length; i++) {
            test.deepLooseEqual([actual_x[i], actual_y[i]], [expected_x[i], expected_y[i]], 'Point ' + i + ' of arrow head');
        }

        graphviz
            .drawEdge(20, -20, 40, -20, {fill: "cyan", stroke: "red"})
            .drawEdge(20, -20, 20, -40, {fill: "blue", stroke: "blue"})
            .drawEdge(20, -20, 0, -20, {fill: "green", stroke: "green"})
            .drawEdge(20, -20, 20, 0, {fill: "yellow", stroke: "yellow"})
            .moveCurrentEdgeEndPoint(50, -30);
        num_edges += 4;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after drawing 5 edges');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after drawing 5 edges');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after drawing 5 edges');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after drawing 5 edges');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after drawing 5 edges');
        graphviz
            .abortDrawing();
        num_edges -= 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after aborting drawing of the current edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after aborting drawing of the current edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons aborting drawing of the current edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses aborting drawing of the current edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after aborting drawing of the current edge');
        graphviz
            .drawEdge(30, -30, 60, -30)
            .insertCurrentEdge('b -> a');
        num_edges += 1;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after inserting the currently drawn edge');
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(endTest);
    }

    function endTest() {
        num_edges = 2;
        test.equal(d3.selectAll('.node').size(), num_nodes, 'Number of nodes after re-rendering with the inserted edge');
        test.equal(d3.selectAll('.edge').size(), num_edges, 'Number of edges after re-rendering with the inserted edge');
        test.equal(d3.selectAll('polygon').size(), 1 + num_edges, 'Number of polygons after re-rendering with the inserted edge');
        test.equal(d3.selectAll('ellipse').size(), num_nodes, 'Number of ellipses after re-rendering with the inserted edge');
        test.equal(d3.selectAll('path').size(), num_edges, 'Number of paths after re-rendering with the inserted edge');
        test.end();
    }

});