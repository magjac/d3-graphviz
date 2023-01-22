import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";

it("onerror() registers dot layout error handler.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    await new Promise(resolve => {
        graphviz.on("initEnd", resolve);
    });

    var errorsCaught = 0;

    let resolve;
    const onErrorHandler = (err)=>{
        errorsCaught += 1;
        resolve(err);
    };

    const err = await new Promise(_resolve => {
        resolve = _resolve;
        graphviz
            .zoom(false)
            .onerror(onErrorHandler)
            .renderDot('{bad dot 1}');
    });

    assert.equal(
        err,
        "syntax error in line 1 near '{'\n",
        'A registered error handler catches syntax errors in the dot source thrown during layout ' + (errorsCaught == 1 ? 'the first' : 'a second') + 'time'
    );

    await new Promise(_resolve => {
        resolve = _resolve;
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
