var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3_graphviz = require("../");

tape("logEvents(true) enables event logging.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {a -> b;}')
        .render();

    test.end();
});
