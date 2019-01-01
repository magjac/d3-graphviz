var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");

tape("graphviz().render() renders growing edges from nodes with shape none and no labels.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .growEnteringEdges(true)
        .zoom(false)
        .renderDot('digraph {a [shape="none" label=""]; b}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
    test.equal(d3.selectAll('g').size(), 3, 'Number of groups');
    test.equal(d3.selectAll('path').size(), 0, 'Number of paths');
    graphviz
        .renderDot('digraph {a [shape="none" label=""]; b; a -> b}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after add');
    test.equal(d3.selectAll('g').size(), 4, 'Number of groups');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.end();
});
