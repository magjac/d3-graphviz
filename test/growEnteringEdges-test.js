var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");

tape("graphviz().render() renders growing edges to nodes with URL attribute.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .growEnteringEdges(true)
        .zoom(false)
        .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('g').size(), 6, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 2, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');
    graphviz
        .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b; a -> c}')
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');
    test.equal(d3.selectAll('g').size(), 9, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 3, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths');

    test.end();
});
