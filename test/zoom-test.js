var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");

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

// Workaround for error in d3-zoom.js:
//   if (e instanceof SVGElement) {
//                    ^
// ReferenceError: SVGElement is not defined
    global.SVGElement = function(){};
    graphviz
        .zoom(true);

    test.ok(graphviz._zoom, '.zoom(true) enables zooming');
    test.notOk(graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

    test.end();
});

tape("zooming rescales transforms during transitions.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

// Workaround for error in d3-zoom.js:
//   if (e instanceof SVGElement) {
//                    ^
// ReferenceError: SVGElement is not defined
    global.SVGElement = function(){};
    graphviz
        .zoom(true)
        .transition(d3_transition.transition().duration(100));

    test.ok(graphviz._zoom, '.zoom(true) enables zooming');
    test.notOk(graphviz._zoomBehavior, 'The zoom behavior is not attached before a graph has been rendered');

    graphviz
        .renderDot('digraph {a -> b;}');

    test.ok(graphviz._zoomBehavior, 'The zoom behavior is attached when the graph has been rendered');

    test.end();
});
