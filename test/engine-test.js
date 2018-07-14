var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");
var d3_selection = require("d3-selection");

tape("engine() selects which graphviz layout engine to use.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .engine('dot')
        .renderDot('digraph {a -> b;}');

    test.ok(d3_selection.select('svg').attr('width', '62pt'), 'The "dot" engine generates an SVG with width 62pt');
    test.ok(d3_selection.select('svg').attr('height', '116pt'), 'The "dot" engine generates an SVG with height 116pt');

    test.end();
});

tape("engine() selects which graphviz layout engine to use.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .engine('circo')
        .renderDot('digraph {a -> b;}');

    test.ok(d3_selection.select('svg').attr('width', '188pt'), 'The "dot" engine generates an SVG with width 188pt');
    test.ok(d3_selection.select('svg').attr('height', '44pt'), 'The "dot" engine generates an SVG with height 44pt');

    test.end();
});
