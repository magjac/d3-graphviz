var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

tape("graphviz() returns an exiting renderer.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz1 = d3_graphviz.graphviz("#graph");

    test.equal(graphviz1.options().tweenShapes, true, "Options have default values when renderer is created");

    graphviz1
        .tweenShapes(false)
        .dot('digraph {a -> b;}')
        .render();

    test.equal(graphviz1.options().tweenShapes, false, "Options are changed when set on the created renderer");

    // Attempt to create a new renderer on the same element

    var graphviz2 = d3_graphviz.graphviz("#graph");

    test.equal(graphviz1, graphviz2, "The returned renderer is the same as the one originally created");
    test.equal(graphviz2.options().tweenShapes, false, "Options set on the originally created renderer is preserved");

    graphviz2
        .dot('digraph {a -> b; a -> c}')
        .render();

    // Attempt to create another new renderer on the same element with different options

    var graphviz3 = d3_graphviz.graphviz("#graph", {tweenShapes: true});

    test.equal(graphviz1, graphviz3, "The returned renderer is the same as the one originally created");
    test.equal(graphviz3.options().tweenShapes, true, "Options are changed if specified when creating the new renderer");

    graphviz3
        .dot('digraph {a -> b; a -> c; a -> d}')
        .render();

    test.end();
});
