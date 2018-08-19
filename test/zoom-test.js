var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");
var d3_zoom = require("d3-zoom");
var d3_selection = require("d3-selection");

tape("zoom(false) disables zooming.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.notOk(graphviz._options.zoom, '.zoom(false) disables zooming');

    test.end();
});

tape("zoom(true) enables zooming.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(true);

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.notOk(graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

    test.end();
});

tape("resetZoom resets the zoom transform to the original transform.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var dx = 10;
    var dy = 20;
    var selection;
    var zoom;

    graphviz
        .zoom(true);

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.notOk(graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    selection = graphviz._zoomSelection;
    zoom = graphviz._zoomBehavior;

    matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
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

    matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
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

    graphviz.resetZoom(
        d3_transition.transition()
            .duration(0)
            .on("end", function() {
                d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
                d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.a),
                'The original zoom transform is restored after zoom reset with transition'
                test.end();
            })
    );
    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.a),
        'The original zoom transform is not restored directly after zoom reset with transition'
    );
});

tape("zooming rescales transforms during transitions.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(true)
        .transition(d3_transition.transition().duration(100));

    test.ok(graphviz._options.zoom, '.zoom(true) enables zooming');
    test.notOk(graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}')
        .on('transitionStart', function() {
            test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
        })
        .on('end', stage2);

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

    test.deepEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity,
        'The zoom transform is equal to the zoom identity transform before transition'
    );

    function stage2() {
        matrix = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
        test.deepEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
            'The zoom transform is equal to the "g" transform after transition'
        );

        graphviz
            .renderDot('digraph {a -> b; b -> c}')
            .on('transitionStart', function() {
                test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', stage3.bind('null', matrix));

        test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        test.deepEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.a),
            'The zoom transform is unchanged before 2nd transition'
        );
    }

    function stage3(matrix1) {
        matrix2 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
        test.notDeepEqual(matrix2, matrix1, 'The "g" transform changes when the graph changes');
        test.deepEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.a),
            'The zoom transform is equal to the "g" transform after 2nd transition'
        );

        test.end();
    }
});

tape("zoomScaleExtent() sets zoom scale extent.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    var extent = [0.5, 4];
    graphviz
        .zoomScaleExtent(extent)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.options().zoomScaleExtent, extent, '.zoomScaleExtent(...) sets zoom scale extent');

    test.end();
});

tape("zoomTranslateExtent() sets zoom translate extent.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoomTranslateExtent(extent)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.options().zoomTranslateExtent, extent, '.zoomTranslateExtent(...) sets zoom translate extent');

    test.end();
});

tape("zoomBehavior() returns the current zoom behavior if zoom is enabled.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoom(true)
        .renderDot('digraph {a -> b;}');

    test.equal(typeof graphviz.zoomBehavior(), 'function', 'The zoom behavior is a function if zoom is enabled');

    test.end();
});

tape("zoomBehavior() returns null if zoom is disabled.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.zoomBehavior(), null, 'The zoom behavior is null if zoom is disabled');

    test.end();
});

tape("zoomSelection() returns the current zoom selection if zoom is enabled.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoom(true)
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz.zoomSelection() instanceof d3_selection.selection, 'The zoom selection is an instance of d3.selection if zoom is enabled');

    test.end();
});

tape("zoomSelection() returns null if zoom is disabled.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    var extent = [[0, 0], [100, 100]];
    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.equal(graphviz.zoomSelection(), null, 'The zoom selection is null if zoom is disabled');

    test.end();
});
