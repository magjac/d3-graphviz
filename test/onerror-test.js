import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

let html = '<div id="graph"></div>';

it("onerror() registers dot layout error handler.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    var errorsCaught = 0;

    function startTest() {
        graphviz
            .zoom(false)
            .onerror(handleError)
            .renderDot('{bad dot 1}');
    }

    function handleError(err) {
        errorsCaught += 1;
        assert.equal(
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
        assert.ok(errorsCaught <= 2, 'The error handler does not catch any errors in correct dot source');
        assert.ok(errorsCaught >= 2, 'The error handler catches errors also after already having caught errors once already');
        graphviz
         .onerror(null);

        function renderDot() {
            graphviz
                .renderDot('{bad dot 3}');
        }

        assert.throws(renderDot, 'Without a registered error handler, errors in the dot source throws error');

        assert.equal(errorsCaught, 2, 'Without a registered error handler, errors in the dot source are not caught');

        resolve();
    }
}));
