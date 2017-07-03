var tape = require("tape"),
    graphviz = require("../");

tape("graphviz() returns the answer to the ultimate question of life, the universe, and everything.", function(test) {
    test.equal(graphviz.render(), 42);
    test.end();
});
