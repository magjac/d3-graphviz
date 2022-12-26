import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

tape("Simple rendering an SVG from graphviz DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph")
        .growEnteringEdges(true)
        .renderDot('digraph {a -> b [style=tapered]}', checkGraph);

    function checkGraph() {
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons');
        test.equal(d3.selectAll('path').size(), 0, 'Number of paths');

        test.end();
    }
});
