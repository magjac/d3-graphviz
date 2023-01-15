import tape from "../tape.js";
import jsdom from "../jsdom.js";
import * as d3_selection from "d3-selection";
import * as d3_graphviz from "../../index.js";

tape("selection.graphviz() returns an instanceof d3.graphviz", async function (test) {
    var window = global.window = jsdom();
    var document = global.document = window.document;
    var root = document.documentElement;
    var selection = d3_selection.select(root);

    var graphviz;

    await new Promise(resolve => {
        graphviz = selection.graphviz()
            .on("initEnd", resolve);
    });

    test.equal(graphviz instanceof d3_graphviz.graphviz, true, "graphviz is an instanceof d3.graphviz");
    test.end();
});

tape("selection.graphviz().dot().render() renders an SVG from graphviz DOT.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_selection.select("#graph").graphviz()
            .zoom(false)
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    test.equal(d3_selection.selectAll('.graph').size(), 1, 'Number of graphs');
    test.equal(d3_selection.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3_selection.selectAll('.edge').size(), 1, 'Number of initial edges');

    test.end();
});
