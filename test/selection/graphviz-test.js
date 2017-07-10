var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3_selection = require("d3-selection"),
    d3_graphviz = require("../../");

tape("selection.graphviz() returns an instanceof d3.graphviz", function(test) {
  var root = jsdom().documentElement,
      selection = d3_selection.select(root),
      graphviz = selection.graphviz();
    test.equal(graphviz instanceof d3_graphviz.graphviz, true, "graphviz is an instanceof d3.graphviz");
    test.end();
});

tape("selection.graphviz().render() renders an SVG from graphviz DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');

    d3_selection.select("#graph")
      .graphviz()
        .render('digraph {a -> b;}');

    test.equal(d3_selection.selectAll('.graph').size(), 1, 'Number of graphs');
    test.equal(d3_selection.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3_selection.selectAll('.edge').size(), 1, 'Number of initial edges');

    test.end();
});

tape("selection.graphviz().render(selection) throw error", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');

    function specifyMultipeSelections() {
        d3_selection.select("#graph")
          .graphviz()
            .dot('digraph {a -> b;}')
            .render("#graph");
    }

    test.throws(specifyMultipeSelections);

    test.end();
});

