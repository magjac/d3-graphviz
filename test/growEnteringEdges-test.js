import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("graphviz().render() renders growing edges to nodes with URL attribute.", async () => {
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
            .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('g').size(), 6, 'Number of groups');
    assert.equal(d3.selectAll('a').size(), 2, 'Number of hyperlinks');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b; a -> c}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');
    assert.equal(d3.selectAll('g').size(), 9, 'Number of groups');
    assert.equal(d3.selectAll('a').size(), 3, 'Number of hyperlinks');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths');

});
