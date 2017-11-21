var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3_selection = require("d3-selection"),
    d3_graphviz = require("../../");

tape("selection.graphviz() returns an instanceof d3.graphviz", function(test) {
  var window = global.window = jsdom();
  var document = global.document = window.document;
  var root = document.documentElement,
      selection = d3_selection.select(root),
      graphviz = selection.graphviz();
    test.equal(graphviz instanceof d3_graphviz.graphviz, true, "graphviz is an instanceof d3.graphviz");
    test.end();
});

tape("selection.graphviz().dot().render() renders an SVG from graphviz DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    d3_selection.select("#graph")
      .graphviz()
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();

    test.equal(d3_selection.selectAll('.graph').size(), 1, 'Number of graphs');
    test.equal(d3_selection.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3_selection.selectAll('.edge').size(), 1, 'Number of initial edges');

    test.end();
});
