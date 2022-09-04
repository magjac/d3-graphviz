import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selection as d3_selection} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import {zoomIdentity as d3_zoomIdentity} from "d3-zoom";
import {zoomTransform as d3_zoomTransform} from "d3-zoom";

const html = '<div id="graph"></div>';

it("zoom(false) disables zooming.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        graphviz
            .zoom(false)
            .renderDot('digraph {a -> b;}');

        assert.ok(!graphviz._options.zoom, '.zoom(false) disables zooming');

        resolve();
    }
}));

it("zoom(true) enables zooming.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        graphviz
            .zoom(true);

        assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
        assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

        graphviz
            .renderDot('digraph {a -> b;}');

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

        resolve();
    }
}));

it("zoom(false) after zoom(true) disables zooming.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        graphviz
            .zoom(true);

        assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
        assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

        graphviz
            .renderDot('digraph {a -> b;}');

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

        graphviz
            .zoom(false);

        assert.ok(!graphviz._options.zoom, '.zoom(false) enables zooming after having been enabled');
        assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached after having been disabled');

        resolve();
    }
}));

it("resetZoom resets the zoom transform to the original transform.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    var dx = 10;
    var dy = 20;
    var selection;
    var zoom;

    function startTest() {
        graphviz
            .zoom(true);

        assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
        assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

        graphviz
            .renderDot('digraph {a -> b;}');

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
        const selection = graphviz._zoomSelection;
        const zoom = graphviz._zoomBehavior;

        const matrix0 = d3_select('g').node().transform.baseVal.consolidate().matrix;
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
            'The zoom transform is equal to the "g" transform after rendering'
        );

        selection.call(zoom.translateBy, dx, dy);
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The zoom transform is translated after zooming'
        );

        const matrix1 = d3_select('g').node().transform.baseVal.consolidate().matrix;
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.a),
            'The zoom transform is equal to the "g" transform after zooming'
        );

        graphviz.resetZoom();
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
            'The original zoom transform is restored after zoom reset'
        );

        selection.call(zoom.translateBy, dx, dy);
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The zoom transform is translated after zooming'
        );

        graphviz.resetZoom(
            d3_transition()
                .duration(0)
                .on("end", function() {
                    d3_zoomTransform(graphviz._zoomSelection.node()),
                    d3_zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
                    'The original zoom transform is restored after zoom reset with transition'
                    resolve();
                })
        );
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The original zoom transform is not restored directly after zoom reset with transition'
        );
    }
}));

it("resetZoom resets the zoom transform to the original transform of the latest rendered graph.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    var dx = 10;
    var dy = 20;
    var selection;
    var zoom;

    function startTest() {
        graphviz
            .zoom(true);

        assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
        assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

        graphviz
            .renderDot('digraph {a -> b;}');

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
        const selection = graphviz._zoomSelection;
        const zoom = graphviz._zoomBehavior;

        const matrix0 = d3_select('g').node().transform.baseVal.consolidate().matrix;
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
            'The zoom transform is equal to the "g" transform after rendering'
        );

        selection.call(zoom.translateBy, dx, dy);
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The zoom transform is translated after zooming'
        );

        const matrix1 = d3_select('g').node().transform.baseVal.consolidate().matrix;
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.a),
            'The zoom transform is equal to the "g" transform after zooming'
        );

        graphviz.resetZoom();
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
            'The original zoom transform is restored after zoom reset'
        );

        selection.call(zoom.translateBy, dx, dy);
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The zoom transform is translated after zooming'
        );

        const height1 = +d3_select('svg').attr("height").replace('pt', '');

        graphviz
            .renderDot('digraph {a -> b; b -> c}');

        const height2 = +d3_select('svg').attr("height").replace('pt', '');

        const matrix2 = {...matrix1};
        matrix2.f += height2 - height1

        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
            'The zoom transform translation is unchanged after rendering'
        );

        graphviz.resetZoom();

        const matrix3 = {...matrix0};
        matrix3.f += height2 - height1

        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix3.e, matrix3.f).scale(matrix3.a),
            'The original zoom transform is restored directly after zoom reset'
        );

        resolve();
    }
}));

it("zooming rescales transforms during transitions.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        graphviz
            .zoom(true)
            .transition(d3_transition().duration(100));

        assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
        assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

        graphviz
            .renderDot('digraph {a -> b;}')
            .on('transitionStart', function() {
                assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', stage2);

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity,
            'The zoom transform is equal to the zoom identity transform before transition'
        );
    }

    function stage2() {
        const matrix = d3_select('g').node().transform.baseVal.consolidate().matrix;
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
            'The zoom transform is equal to the "g" transform after transition'
        );

        graphviz
            .transition(d3_transition().duration(100))
            .renderDot('digraph {a -> b; b -> c}')
            .on('transitionStart', function() {
                assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', stage3.bind('null', matrix));

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
            'The zoom transform is unchanged before 2nd transition'
        );
    }

    function stage3(matrix1) {
        const matrix2 = d3_select('g').node().transform.baseVal.consolidate().matrix;
        assert.notDeepEqual(matrix2, matrix1, 'The "g" transform changes when the graph changes');
        assert.deepEqual(
            d3_zoomTransform(graphviz._zoomSelection.node()),
            d3_zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
            'The zoom transform is equal to the "g" transform after 2nd transition'
        );

        resolve();
    }
}));

it("zoomScaleExtent() sets zoom scale extent.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        var extent = [0.5, 4];
        graphviz
            .zoomScaleExtent(extent)
            .renderDot('digraph {a -> b;}');

        assert.equal(graphviz.options().zoomScaleExtent, extent, '.zoomScaleExtent(...) sets zoom scale extent');

        resolve();
    }
}));

it("zoomTranslateExtent() sets zoom translate extent.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        var extent = [[0, 0], [100, 100]];
        graphviz
            .zoomTranslateExtent(extent)
            .renderDot('digraph {a -> b;}');

        assert.equal(graphviz.options().zoomTranslateExtent, extent, '.zoomTranslateExtent(...) sets zoom translate extent');

        resolve();
    }
}));

it("zoomBehavior() returns the current zoom behavior if zoom is enabled.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        var extent = [[0, 0], [100, 100]];
        graphviz
            .zoom(true)
            .renderDot('digraph {a -> b;}');

        assert.equal(typeof graphviz.zoomBehavior(), 'function', 'The zoom behavior is a function if zoom is enabled');

        resolve();
    }
}));

it("zoomBehavior() returns null if zoom is disabled.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        var extent = [[0, 0], [100, 100]];
        graphviz
        .zoom(false)
            .renderDot('digraph {a -> b;}');

        assert.equal(graphviz.zoomBehavior(), null, 'The zoom behavior is null if zoom is disabled');

        resolve();
    }
}));

it("zoomSelection() returns the current zoom selection if zoom is enabled.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        var extent = [[0, 0], [100, 100]];
        graphviz
            .zoom(true)
            .renderDot('digraph {a -> b;}');

        assert.ok(graphviz.zoomSelection() instanceof d3_selection, 'The zoom selection is an instance of d3_selection if zoom is enabled');

        resolve();
    }
}));

it("zoomSelection() returns null if zoom is disabled.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', startTest);

    function startTest() {
        var extent = [[0, 0], [100, 100]];
        graphviz
            .zoom(false)
            .renderDot('digraph {a -> b;}');

        assert.equal(graphviz.zoomSelection(), null, 'The zoom selection is null if zoom is disabled');

        resolve();
    }
}));
