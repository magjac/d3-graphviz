import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().tweenPaths(true) enables path tweening during transitions.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest)

    function startTest() {
        graphviz
            .tweenShapes(false)
            .tweenPaths(true)
            .tweenPrecision(4)
            .zoom(false)
            .dot('digraph {a -> b; c}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of initial polygons');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of initial ellipses');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');
        const transition1 = d3_transition().duration(100);
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .transition(transition1)
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", part1_end);
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    }

    function part1_end() {

        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes after transition');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after transition');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons after transition');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths after transition');

        resolve();
    }
}));
