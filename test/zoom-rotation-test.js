import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";
import * as d3_transition from "d3-transition";
import * as d3_zoom from "d3-zoom";
import * as d3_selection from "d3-selection";

it("resetZoom resets the zoom transform to the original transform when rotate=90.", async () => {
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
            .renderDot('digraph {rotate=90; a -> b;}', resolve);
    });

    assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    const selection = graphviz._zoomSelection;
    const zoom = graphviz._zoomBehavior;

    const matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.c),
        'The zoom transform is equal to the "g" transform after rendering'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.c),
        'The zoom transform is translated after zooming'
    );

    const matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.c),
        'The zoom transform is equal to the "g" transform after zooming'
    );

    graphviz.resetZoom();
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.c),
        'The original zoom transform is restored after zoom reset'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.c),
        'The zoom transform is translated after zooming'
    );

    await new Promise(resolve => {
        graphviz.resetZoom(
            d3_transition.transition()
                .duration(0)
                .on("end", function() {
                    d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
                        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.c),
                    'The original zoom transform is restored after zoom reset with transition'
                    resolve();
                })
        );
        assert.deepStrictEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.c),
            'The original zoom transform is not restored directly after zoom reset with transition'
        );
    });

});

it("resetZoom resets the zoom transform to the original transform of the latest rendered graph when rotate=90.", async () => {
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
        .renderDot('digraph {rotate=90; a -> b;}');

    assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');
    const selection = graphviz._zoomSelection;
    const zoom = graphviz._zoomBehavior;

    const matrix0 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.c),
        'The zoom transform is equal to the "g" transform after rendering'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.c),
        'The zoom transform is translated after zooming'
    );

    const matrix1 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix1.e, matrix1.f).scale(matrix1.c),
        'The zoom transform is equal to the "g" transform after zooming'
    );

    graphviz.resetZoom();
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e, matrix0.f).scale(matrix0.c),
        'The original zoom transform is restored after zoom reset'
    );

    selection.call(zoom.translateBy, dx, dy);
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix0.e + dx, matrix0.f + dy).scale(matrix0.c),
        'The zoom transform is translated after zooming'
    );

    const width1 = +d3_selection.select('svg').attr("width").replace('pt', '');

    graphviz
        .renderDot('digraph {rotate=90; a -> b; b -> c}');

    const width2 = +d3_selection.select('svg').attr("width").replace('pt', '');

    const matrix2 = { ...matrix1 };
    matrix2.e += width2 - width1

    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.c),
        'The zoom transform translation is unchanged after rendering'
    );

    graphviz.resetZoom();

    const matrix3 = { ...matrix0 };
    matrix3.e += width2 - width1

    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix3.e, matrix3.f).scale(matrix3.c),
        'The original zoom transform is restored directly after zoom reset'
    );

});

it("zooming rescales transforms during transitions when rotate=90.", async () => {
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
            .renderDot('digraph {rotate=90; a -> b;}')
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
        d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.c),
        'The zoom transform is equal to the "g" transform after transition'
    );

    await new Promise(resolve => {
        graphviz
            .transition(d3_transition.transition().duration(100))
            .renderDot('digraph {rotate=90; a -> b; b -> c}')
            .on('transitionStart', function() {
                assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when transition starts');
            })
            .on('end', resolve);

        assert.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph rendering has been initiated');

        assert.deepStrictEqual(
            d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
            d3_zoom.zoomIdentity.translate(matrix.e, matrix.f).scale(matrix.c),
            'The zoom transform is unchanged before 2nd transition'
        );
    });

    const matrix2 = d3_selection.select('g').node().transform.baseVal.consolidate().matrix;
    assert.notDeepEqual(matrix2, matrix, 'The "g" transform changes when the graph changes');
    assert.deepStrictEqual(
        d3_zoom.zoomTransform(graphviz._zoomSelection.node()),
        d3_zoom.zoomIdentity.translate(matrix2.e, matrix2.f).scale(matrix2.c),
        'The zoom transform is equal to the "g" transform after 2nd transition'
    );

});
