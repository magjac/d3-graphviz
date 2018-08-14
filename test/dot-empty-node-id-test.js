var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

tape("renderDot() renders a node with an empty string as node_id.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {""}')
        .render();

    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges');

    test.end();
});
