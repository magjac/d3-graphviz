var tape = require("tape"),
    graphviz = require("../");

tape("graphviz() renders an SVG from graphviz DOT.", function(test) {
    test.equal(graphviz.render('digraph {a -> b;}'), 42);
    test.end();
});
