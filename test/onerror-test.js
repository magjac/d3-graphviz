var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");

tape("onerror() registers dot layout error handler.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var errorsCaught = 0;

    graphviz
        .zoom(false)
        .onerror(handleError)
        .renderDot('{bad dot 1}');

    function handleError(err) {
        errorsCaught += 1;
        test.equal(
            err,
            "syntax error in line 1 near '{'\n",
            'A registered error handler catches syntax errors in the dot source thrown during layout ' + (errorsCaught == 1 ? 'the first' : 'a second') + 'time'
        );
        if (errorsCaught == 1) {
            graphviz
                .renderDot('{bad dot 2}', stage2);
        } else {
           graphviz
                .renderDot('digraph {a -> b}', stage2);
        }
    }

    function stage2(err) {
        test.ok(errorsCaught <= 2, 'The error handler does not catch any errors in correct dot source');
        test.ok(errorsCaught >= 2, 'The error handler catches errors also after already having caught errors once already');
        graphviz
         .onerror(null);

        function renderDot() {
            graphviz
                .renderDot('{bad dot 3}');
        }

        test.throws(renderDot, 'Without a registered error handler, errors in the dot source throws error');

        test.equal(errorsCaught, 2, 'Without a registered error handler, errors in the dot source are not caught');

        test.end();
    }
});
