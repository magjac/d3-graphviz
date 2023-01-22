import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";
import * as d3_transition from "d3-transition";
import * as d3_zoom from "d3-zoom";
import * as d3_selection from "d3-selection";

it("zoom(false) disables zooming.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    assert.ok(!graphviz._options.zoom, '.zoom(false) disables zooming');

});

it("zoom(true) enables zooming.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true);

    assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

});

it("zoom(false) after zoom(true) disables zooming.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

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


});

it("resetZoom resets the zoom transform to the original transform.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    var dx = 10;
    var dy = 20;

    graphviz
        .zoom(true);

    assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}', resolve);
    });

    assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    const selection = graphviz._zoomSelection;
    const zoom = graphviz._zoomBehavior;

    const xxx1 = d3_selection.select('g').node();
    const matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The zoom transform is equal to the "g" transform after rendering'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The zoom transform is translated after zooming'
    );

    const matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.a),
        'The zoom transform is equal to the "g" transform after zooming'
    );

    graphviz.resetZoom();
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The original zoom transform is restored after zoom reset'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The zoom transform is translated after zooming'
    );

    await new Promise(resolve => {
        graphviz.resetZoom(
            d3_transition.transition()
                .duration(0)
                .on("end", function() {
                    d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
                        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
                    'The original zoom transform is restored after zoom reset with transition'
                    resolve();
                })
        );
        assert.deepStrictEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The original zoom transform is not restored directly after zoom reset with transition'
        );
    });

});

it("resetZoom resets the zoom transform to the original transform of the latest rendered graph.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    var dx = 10;
    var dy = 20;

    graphviz
        .zoom(true);

    assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    const selection = graphviz._zoomSelection;
    const zoom = graphviz._zoomBehavior;

    const matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The zoom transform is equal to the "g" transform after rendering'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The zoom transform is translated after zooming'
    );

    const matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.a),
        'The zoom transform is equal to the "g" transform after zooming'
    );

    graphviz.resetZoom();
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The original zoom transform is restored after zoom reset'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The zoom transform is translated after zooming'
    );

    const height1 = +d3_selection.select('svg').attr("height").replace('pt', '');

    graphviz
        .renderDot('digraph {a -> b; b -> c}');

    const height2 = +d3_selection.select('svg').attr("height").replace('pt', '');

    const matrix2 = { ...matrix1 };
    matrix2.f += height2 - height1

    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
        'The zoom transform translation is unchanged after rendering'
    );

    graphviz.resetZoom();

    const matrix3 = { ...matrix0 };
    matrix3.f += height2 - height1

    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix3.e, matrix3.f).scale(matrix3.a),
        'The original zoom transform is restored directly after zoom reset'
    );

});

it("zooming rescales transforms during transitions.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true)
        .transition(d3_transition.transition().duration(100));

    assert.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    assert.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}')
            .on('transitionStart', function() {
                assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', resolve);

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        assert.deepStrictEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity,
            'The zoom transform is equal to the zoom identity transform before transition'
        );
    });

    const matrix = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
        'The zoom transform is equal to the "g" transform after transition'
    );

    await new Promise(resolve => {
        graphviz
            .transition(d3_transition.transition().duration(100))
            .renderDot('digraph {a -> b; b -> c}')
            .on('transitionStart', function() {
                assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', resolve);

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        assert.deepStrictEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
            'The zoom transform is unchanged before 2nd transition'
        );
    });

    const matrix2 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.notDeepEqual(matrix2, matrix, 'The "g" transform changes when the graph changes');
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
        'The zoom transform is equal to the "g" transform after 2nd transition'
    );

});

it("zoomScaleExtent() sets zoom scale extent.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    var extent = [0.5, 4];
    graphviz
        .zoomScaleExtent(extent)
        .renderDot('digraph {a -> b;}');

    assert.equal(graphviz.options().zoomScaleExtent, extent, '.zoomScaleExtent(...) sets zoom scale extent');

});

it("zoomTranslateExtent() sets zoom translate extent.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);

    });

    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoomTranslateExtent(extent)
        .renderDot('digraph {a -> b;}');

    assert.equal(graphviz.options().zoomTranslateExtent, extent, '.zoomTranslateExtent(...) sets zoom translate extent');

});

it("zoomBehavior() returns the current zoom behavior if zoom is enabled.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true)
        .renderDot('digraph {a -> b;}');

    assert.equal(typeof graphviz.zoomBehavior(), 'function', 'The zoom behavior is a function if zoom is enabled');

});

it("zoomBehavior() returns null if zoom is disabled.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    assert.equal(graphviz.zoomBehavior(), null, 'The zoom behavior is null if zoom is disabled');

});

it("zoomSelection() returns the current zoom selection if zoom is enabled.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true)
        .renderDot('digraph {a -> b;}');

    assert.ok(graphviz.zoomSelection() instanceof d3_selection.selection, 'The zoom selection is an instance of d3_selection if zoom is enabled');

});

it("zoomSelection() returns null if zoom is disabled.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    assert.equal(graphviz.zoomSelection(), null, 'The zoom selection is null if zoom is disabled');

});
