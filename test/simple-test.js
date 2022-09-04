import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("Simple rendering an SVG from graphviz DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .renderDot('digraph {a -> b;}', checkGraph);

    function checkGraph() {
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

        resolve();
    }
}));
