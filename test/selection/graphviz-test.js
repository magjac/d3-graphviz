import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../../index.js";
import it from "../jsdom.js";

it("selection.graphviz() returns an instanceof d3_graphviz", () => new Promise(resolve => {
  var root = document.documentElement,
      selection = d3_select(root),
      graphviz = selection.graphviz()
      .on("initEnd", startTest);

    function startTest() {
        assert.equal(graphviz instanceof d3_graphviz, true, "graphviz is an instanceof d3_graphviz");
        resolve();
    }
}));

const html = '<div id="graph"></div>';

it("selection.graphviz().dot().render() renders an SVG from graphviz DOT.", html, () => new Promise(resolve => {

    var graphviz = d3_select("#graph")
      .graphviz()
        .zoom(false)
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .dot('digraph {a -> b;}')
            .render();
        assert.equal(d3_selectAll('.graph').size(), 1, 'Number of graphs');
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');

        resolve();
    }
}));
