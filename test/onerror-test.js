import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

let html = '<div id="graph"></div>';

it("onerror() registers dot layout error handler.", html, async () => {
    var graphviz = d3_graphviz("#graph");

    await new Promise(resolve => {
        graphviz.on("initEnd", resolve);
    });

    var errorsCaught = 0;

    const err = await new Promise(resolve => {
        graphviz
            .zoom(false)
            .onerror(resolve)
            .renderDot('{bad dot 1}');
    });

    errorsCaught += 1;
    assert.equal(
        err,
        "syntax error in line 1 near '{'\n",
        'A registered error handler catches syntax errors in the dot source thrown during layout ' + (errorsCaught == 1 ? 'the first' : 'a second') + 'time'
    );

    await new Promise(resolve => {
        if (errorsCaught == 1) {
            graphviz
                .renderDot('{bad dot 2}', resolve);
        } else {
           graphviz
               .renderDot('digraph {a -> b}', resolve);
        }
    });

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

});
