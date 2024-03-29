import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().tweenPrecision can be absolute.", async () => {

    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    const length = 100;

    graphviz.tweenPrecision(2);
    const absPrecision = graphviz.options().tweenPrecision;
    assert.equal(absPrecision, 2, 'tweenPrecision is 2');

    graphviz
        .tweenShapes(false)
        .tweenPaths(true)
        .zoom(false)
        .on("transitionStart", () => {
            let edge = d3.selectAll('.edge').filter(function (d, i) {
                return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            assert.equal(numPoints, 5, 'Number of points on tweened path');
        })
        .on("transitionEnd", () => {
            let edge = d3.selectAll('.edge').filter(function (d, i) {
                return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            assert.equal(numPoints, 100 / absPrecision + 2, 'Number points on tweened path');
        })
        .dot('digraph {a -> b; a -> c}')
        .render();
    assert.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of initial paths');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; a -> c; b -> c}')
            .transition(() => d3_transition.transition().duration(100))
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", resolve);

        assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges immediately after rendering');
        assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        assert.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    });

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after transition');
    assert.equal(d3.selectAll('.edge').size(), 3, 'Number of edges after transition');
    assert.equal(d3.selectAll('polygon').size(), 4, 'Number of polygons after transition');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses after transition');
    assert.equal(d3.selectAll('path').size(), 3, 'Number of paths after transition');

});


it("graphviz().tweenPrecision can be relative.", async () => {
    var graphviz;

    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    graphviz.tweenPrecision('20%');
    const precision = graphviz.options().tweenPrecision;
    assert.equal(precision, '20%', 'tweenPrecision is 10%');
    const relPrecision = precision.split('%')[0] / 100;

    graphviz
        .tweenShapes(false)
        .tweenPaths(true)
        .zoom(false)
        .on("transitionStart", () => {
            let edge = d3.selectAll('.edge').filter(function (d, i) {
                return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            assert.equal(numPoints, 5, 'Number of points on tweened path');
        })
        .on("transitionEnd", () => {
            let edge = d3.selectAll('.edge').filter(function (d, i) {
                return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            assert.equal(numPoints, 1 / relPrecision + 2, 'Number points on tweened path');
        })
        .dot('digraph {a -> b; a -> c}')
        .render();
    assert.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of initial paths');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; a -> c; b -> c}')
            .transition(() => d3_transition.transition().duration(100))
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", resolve);

        assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges immediately after rendering');
        assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        assert.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    });

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after transition');
    assert.equal(d3.selectAll('.edge').size(), 3, 'Number of edges after transition');
    assert.equal(d3.selectAll('polygon').size(), 4, 'Number of polygons after transition');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses after transition');
    assert.equal(d3.selectAll('path').size(), 3, 'Number of paths after transition');

});
