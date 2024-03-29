import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("graphviz().render() renders growing edges to nodes with URL attribute.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

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
            .renderDot('digraph {a; b [shape="cylinder"]}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
    assert.equal(d3.selectAll('g').size(), 3, 'Number of groups');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a; b [shape="cylinder"]; a -> b}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after add');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after add');
    assert.equal(d3.selectAll('g').size(), 4, 'Number of groups');
    assert.equal(d3.selectAll('path').size(), 3, 'Number of paths');

});
