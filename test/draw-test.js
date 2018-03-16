var tape = require("tape");
var jsdom = require("./jsdom");
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
        graphviz
            .drawEdge(20, -20, 40, -20)
            .drawEdge(20, -20, 40, -20, {fill: "cyan", stroke: "red"})
            .drawEdge(20, -20, 20, -40, {fill: "blue", stroke: "blue"})
            .drawEdge(20, -20, 0, -20, {fill: "green", stroke: "green"})
            .drawEdge(20, -20, 20, 0, {fill: "yellow", stroke: "yellow"})
            .moveCurrentEdgeEndPoint(50, -30)
            .abortDrawing();
        test.end();
    }

});
