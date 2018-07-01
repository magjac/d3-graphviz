var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

tape("Simple rendering an SVG from graphviz DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .renderDot('digraph {a -> b;}');

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.end();
});
