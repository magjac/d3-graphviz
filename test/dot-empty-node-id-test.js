import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("renderDot() renders a node with an empty string as node_id.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', () => {

            graphviz
                .tweenShapes(false)
                .zoom(false)
                .dot('digraph {""}')
                .render();

            assert.equal(d3_selectAll('.node').size(), 1, 'Number of nodes');
            assert.equal(d3_selectAll('.edge').size(), 0, 'Number of edges');

            resolve();
        });
}));
