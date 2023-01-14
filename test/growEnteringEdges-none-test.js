import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("graphviz().render() renders growing edges from nodes with shape none.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .growEnteringEdges(true)
            .zoom(false)
            .renderDot('digraph {a [shape="none"]; b}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
    assert.equal(d3.selectAll('g').size(), 3, 'Number of groups');
    assert.equal(d3.selectAll('path').size(), 0, 'Number of paths');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a [shape="none"]; b; a -> b}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after add');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after add');
    assert.equal(d3.selectAll('g').size(), 4, 'Number of groups');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');

});
