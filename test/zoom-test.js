import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";
import * as d3_transition from "d3-transition";
import * as d3_zoom from "d3-zoom";
import * as d3_selection from "d3-selection";

tape("zoom(false) disables zooming.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.ok(!graphviz._options.zoom, '.zoom(false) disables zooming');

    test.end();
});

tape("zoom(true) enables zooming.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true);

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

    test.end();
});

tape("zoom(false) after zoom(true) disables zooming.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true);

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

    graphviz
        .zoom(false);

    test.ok(!graphviz._options.zoom, '.zoom(false) enables zooming after having been enabled');
    test.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached after having been disabled');


    test.end();
});

tape("resetZoom resets the zoom transform to the original transform.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    var dx = 10;
    var dy = 20;

    graphviz
        .zoom(true);

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}', resolve);
    });

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    const selection = graphviz._zoomSelection;
    const zoom = graphviz._zoomBehavior;

    const xxx1 = d3_selection.select('g').node();
    const matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The zoom transform is equal to the "g" transform after rendering'
    );

    selection.call(zoom.translateBy, dx, dy);
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The zoom transform is translated after zooming'
    );

    const matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.a),
        'The zoom transform is equal to the "g" transform after zooming'
    );

    graphviz.resetZoom();
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The original zoom transform is restored after zoom reset'
    );

    selection.call(zoom.translateBy, dx, dy);
    test.deepEqual(
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
        test.deepEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
            'The original zoom transform is not restored directly after zoom reset with transition'
        );
    });

    test.end();
});

tape("resetZoom resets the zoom transform to the original transform of the latest rendered graph.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    var dx = 10;
    var dy = 20;

    graphviz
        .zoom(true);

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    const selection = graphviz._zoomSelection;
    const zoom = graphviz._zoomBehavior;

    const matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The zoom transform is equal to the "g" transform after rendering'
    );

    selection.call(zoom.translateBy, dx, dy);
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The zoom transform is translated after zooming'
    );

    const matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.a),
        'The zoom transform is equal to the "g" transform after zooming'
    );

    graphviz.resetZoom();
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
        'The original zoom transform is restored after zoom reset'
    );

    selection.call(zoom.translateBy, dx, dy);
    test.deepEqual(
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

    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
        'The zoom transform translation is unchanged after rendering'
    );

    graphviz.resetZoom();

    const matrix3 = { ...matrix0 };
    matrix3.f += height2 - height1

    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix3.e, matrix3.f).scale(matrix3.a),
        'The original zoom transform is restored directly after zoom reset'
    );

    test.end();
});

tape("zooming rescales transforms during transitions.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true)
        .transition(d3_transition.transition().duration(100));

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.ok(!graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}')
            .on('transitionStart', function() {
                test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', resolve);

        test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        test.deepEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity,
            'The zoom transform is equal to the zoom identity transform before transition'
        );
    });

    const matrix = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
        'The zoom transform is equal to the "g" transform after transition'
    );

    await new Promise(resolve => {
        graphviz
            .transition(d3_transition.transition().duration(100))
            .renderDot('digraph {a -> b; b -> c}')
            .on('transitionStart', function() {
                test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', resolve);

        test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        test.deepEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
            'The zoom transform is unchanged before 2nd transition'
        );
    });

    const matrix2 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    test.notDeepEqual(matrix2, matrix, 'The "g" transform changes when the graph changes');
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
        'The zoom transform is equal to the "g" transform after 2nd transition'
    );

    test.end();
});

tape("zoomScaleExtent() sets zoom scale extent.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    var extent = [0.5, 4];
    graphviz
        .zoomScaleExtent(extent)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.options().zoomScaleExtent, extent, '.zoomScaleExtent(...) sets zoom scale extent');

    test.end();
});

tape("zoomTranslateExtent() sets zoom translate extent.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);

    });

    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoomTranslateExtent(extent)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.options().zoomTranslateExtent, extent, '.zoomTranslateExtent(...) sets zoom translate extent');

    test.end();
});

tape("zoomBehavior() returns the current zoom behavior if zoom is enabled.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true)
        .renderDot('digraph {a -> b;}');

    test.equal(typeof graphviz.zoomBehavior(), 'function', 'The zoom behavior is a function if zoom is enabled');

    test.end();
});

tape("zoomBehavior() returns null if zoom is disabled.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.zoomBehavior(), null, 'The zoom behavior is null if zoom is disabled');

    test.end();
});

tape("zoomSelection() returns the current zoom selection if zoom is enabled.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(true)
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz.zoomSelection() instanceof d3_selection.selection, 'The zoom selection is an instance of d3_selection if zoom is enabled');

    test.end();
});

tape("zoomSelection() returns null if zoom is disabled.", async function (test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.zoomSelection(), null, 'The zoom selection is null if zoom is disabled');

    test.end();
});
