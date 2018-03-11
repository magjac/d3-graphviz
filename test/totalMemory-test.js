var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");

tape("totalMemory() sets the total memory available to Viz.js.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var errorsCaught = 0;

    graphviz
        .zoom(false)
        .onerror(handleError)
        .totalMemory(65535)
        .renderDot('digraph {a -> b}', stage2);

    function handleError(err) {
        errorsCaught += 1;
        if (errorsCaught == 1) {
            test.equal(
                err,
                'byte length of Int16Array should be a multiple of 2',
                'An error is thrown if the memory given with totalMemory() is not a power of 2'
            );
            graphviz
                .totalMemory(65536)
                .renderDot('digraph {a -> b}')
        } else {
            test.equal(
                err,
                "Source is too large",
                'An error is thrown if too little memory is given with totalMemory()'
            );
            graphviz
                .totalMemory(16777216)
                .renderDot('digraph {a -> b}', stage2)
        }
    }

    function stage2(err) {

        test.equal(errorsCaught, 2, 'No error is thrown if enough memory is given with totalMemory()');

        test.end();
    }
});
