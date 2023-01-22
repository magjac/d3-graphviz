import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("renderDot() renders a node with an empty string as node_id.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    var graphviz = d3_graphviz.graphviz("#graph");

    await new Promise(resolve => {
        graphviz
            .on('initEnd', resolve);
    })

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {""}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of nodes');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges');
});
