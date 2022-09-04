import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().render() renders growing edges to nodes with URL attribute.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .growEnteringEdges(true)
            .zoom(false)
            .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b;}');
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('g').size(), 6, 'Number of groups');
        assert.equal(d3_selectAll('a').size(), 2, 'Number of hyperlinks');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');
        graphviz
            .renderDot('digraph {node [URL="DUMMY-URL"]; a -> b; a -> c}')
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes after add');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after add');
        assert.equal(d3_selectAll('g').size(), 9, 'Number of groups');
        assert.equal(d3_selectAll('a').size(), 3, 'Number of hyperlinks');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths');

        resolve();
    }
}));
