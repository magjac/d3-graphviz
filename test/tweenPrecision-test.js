import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selectAll as d3_selectAll} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().tweenPrecision can be absolute.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    const length = 100;

    graphviz.tweenPrecision(2);
    const absPrecision = graphviz.options().tweenPrecision;
    assert.equal(absPrecision, 2, 'tweenPrecision is 2');

    function startTest() {
        graphviz
            .tweenShapes(false)
            .tweenPaths(true)
            .zoom(false)
            .on("transitionStart", () => {
                let edge = d3_selectAll('.edge').filter(function(d, i) {
                  return d3_select(this).selectWithoutDataPropagation('title').text() == 'a->c';
                });
                let path = edge.selectWithoutDataPropagation('path');
                const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
                assert.equal(numPoints, 5, 'Number of points on tweened path');
            })
            .on("transitionEnd", () => {
                let edge = d3_selectAll('.edge').filter(function(d, i) {
                  return d3_select(this).selectWithoutDataPropagation('title').text() == 'a->c';
                });
                let path = edge.selectWithoutDataPropagation('path');
                const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
                assert.equal(numPoints, 100 / absPrecision + 2, 'Number points on tweened path');
            })
            .dot('digraph {a -> b; a -> c}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of initial edges');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of initial polygons');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of initial ellipses');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of initial paths');
        graphviz
            .dot('digraph {a -> b; a -> c; b -> c}')
            .transition(() => d3_transition().duration(100))
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", part1_end);

        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges immediately after rendering');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    }

    function part1_end() {

        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes after transition');
        assert.equal(d3_selectAll('.edge').size(), 3, 'Number of edges after transition');
        assert.equal(d3_selectAll('polygon').size(), 4, 'Number of polygons after transition');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses after transition');
        assert.equal(d3_selectAll('path').size(), 3, 'Number of paths after transition');

        resolve();
    }
}));


it("graphviz().tweenPrecision can be relative.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    graphviz.tweenPrecision('20%');
    const precision = graphviz.options().tweenPrecision;
    assert.equal(precision, '20%', 'tweenPrecision is 10%');
    const relPrecision = precision.split('%')[0] / 100;

    function startTest() {
        graphviz
            .tweenShapes(false)
            .tweenPaths(true)
            .zoom(false)
            .on("transitionStart", () => {
                let edge = d3_selectAll('.edge').filter(function(d, i) {
                  return d3_select(this).selectWithoutDataPropagation('title').text() == 'a->c';
                });
                let path = edge.selectWithoutDataPropagation('path');
                const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
                assert.equal(numPoints, 5, 'Number of points on tweened path');
            })
            .on("transitionEnd", () => {
                let edge = d3_selectAll('.edge').filter(function(d, i) {
                  return d3_select(this).selectWithoutDataPropagation('title').text() == 'a->c';
                });
                let path = edge.selectWithoutDataPropagation('path');
                const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
                assert.equal(numPoints, 1 / relPrecision + 2, 'Number points on tweened path');
            })
            .dot('digraph {a -> b; a -> c}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of initial edges');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of initial polygons');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of initial ellipses');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of initial paths');
        graphviz
            .dot('digraph {a -> b; a -> c; b -> c}')
            .transition(() => d3_transition().duration(100))
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", part1_end);

        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges immediately after rendering');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    }

    function part1_end() {

        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes after transition');
        assert.equal(d3_selectAll('.edge').size(), 3, 'Number of edges after transition');
        assert.equal(d3_selectAll('polygon').size(), 4, 'Number of polygons after transition');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses after transition');
        assert.equal(d3_selectAll('path').size(), 3, 'Number of paths after transition');

        resolve();
    }
}));
