var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");

tape("drawEdge and moveCurrentEdgeEndPoint draws and modifies an edge", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {a -> b;}')
        .render(drawEdge);

    function drawEdge() {
        test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
        graphviz
            .drawEdge(20, -20, 40, -20)
            .drawEdge(20, -20, 40, -20, {fill: "cyan", stroke: "red"})
            .drawEdge(20, -20, 20, -40, {fill: "blue", stroke: "blue"})
            .drawEdge(20, -20, 0, -20, {fill: "green", stroke: "green"})
            .drawEdge(20, -20, 20, 0, {fill: "yellow", stroke: "yellow"})
            .moveCurrentEdgeEndPoint(50, -30);
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after drawing 5 edges');
        test.equal(d3.selectAll('.edge').size(), 6, 'Number of edges after drawing 5 edges');
        test.equal(d3.selectAll('polygon').size(), 7, 'Number of polygons after drawing 5 edges');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after drawing 5 edges');
        test.equal(d3.selectAll('path').size(), 6, 'Number of paths after drawing 5 edges');
        graphviz
            .abortDrawing();
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after aborting drawing of the current edge');
        test.equal(d3.selectAll('.edge').size(), 5, 'Number of edges after aborting drawing of the current edge');
        test.equal(d3.selectAll('polygon').size(), 6, 'Number of polygons aborting drawing of the current edge');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses aborting drawing of the current edge');
        test.equal(d3.selectAll('path').size(), 5, 'Number of paths after aborting drawing of the current edge');
        graphviz
            .drawEdge(30, -30, 60, -30)
            .insertCurrentEdge('b -> a');
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after inserting the currently drawn edge');
        test.equal(d3.selectAll('.edge').size(), 6, 'Number of edges after inserting the currently drawn edge');
        test.equal(d3.selectAll('polygon').size(), 7, 'Number of polygons after inserting the currently drawn edge');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after inserting the currently drawn edge');
        test.equal(d3.selectAll('path').size(), 6, 'Number of paths after inserting the currently drawn edge');
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .render(endTest);
    }

    function endTest() {
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after re-rendering with the inserted edge');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after re-rendering with the inserted edge');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after re-rendering with the inserted edge');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after re-rendering with the inserted edge');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths after re-rendering with the inserted edge');
        test.end();
    }

});
