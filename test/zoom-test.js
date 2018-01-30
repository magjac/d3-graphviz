var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");
var d3_zoom = require("d3-zoom");
var d3_selection = require("d3-selection");

function polyfillSVGElement() {
    if (!('width' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'width', {
            get: function() {
                return {
                    baseVal: {
                            value: +this.getAttribute('width').replace('pt', ''),
                    }
                };
            }
        });
    }
    if (!('height' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'height', {
            get: function() {
                return {
                    baseVal: {
                        value: +this.getAttribute('height').replace('pt', ''),
                    }
                };
            }
        });
    }
    if (!('transform' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'transform', {
            get: function() {
                if (this.getAttribute('transform')) {
                    var translate = this.getAttribute('transform').replace(/.*translate\((\d+[ ,]+\d+)\).*/, function(match, xy) {
                        return xy;
                    }).split(/[ ,]+/).map(function(v) {
                        return +v;
                    });
                    var scale = this.getAttribute('transform').replace(/.*.*scale\((\d+[ ,]*\d*)\).*/, function(match, scale) {
                        return scale;
                    }).split(/[ ,]+/).map(function(v) {
                        return +v;
                    });
                    return {
                        baseVal: {
                            numberOfItems: 1,
                            consolidate: function() {
                                return {
                                    matrix: {
                                        'a': scale[0],
                                        'b': 0,
                                        'c': 0,
                                        'd': scale[1] || scale[0],
                                        'e': translate[0],
                                        'f': translate[1],
                                    }
                                };
                            },
                        },
                    };
                } else {
                    return null;
                }
            },
        });
    }
    global.SVGElement = window.SVGElement;
}

tape("zoom(false) disables zooming.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    graphviz
        .zoom(false)
        .renderDot('digraph {a -> b;}');

    test.notOk(graphviz._zoom, '.zoom(false) disables zooming');

    test.end();
});

tape("zoom(true) enables zooming.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    polyfillSVGElement();

    graphviz
        .zoom(true);

    test.ok(graphviz._zoom, '.zoom(true) enables zooming');
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

    polyfillSVGElement();

    var dx = 10;
    var dy = 20;
    var selection;
    var zoom;

    graphviz
        .zoom(true);

    test.ok(graphviz._zoom, '.zoom(true) enables zooming');
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

    test.end();
});

tape("zooming rescales transforms during transitions.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    polyfillSVGElement();

    graphviz
        .zoom(true)
        .transition(d3_transition.transition().duration(100));

    test.ok(graphviz._zoom, '.zoom(true) enables zooming');
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

        test.end();
    }
});
