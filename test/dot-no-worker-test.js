import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import Worker from "tiny-worker";

async function do_test(useWorker, html) {
    var window = global.window = jsdom(html);
    var document = global.document = window.document;
    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz.graphviz("#graph", useWorker);
    await new Promise(resolve => {
        graphviz.on('initEnd', resolve);
    });

    assert.equal(graphviz._data, undefined, 'No data is attached before calling dot');

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .onerror(callbackThatShouldNotBeCalled)
        .dot('digraph {a -> b; c}');

    assert.notEqual(graphviz._data, undefined, 'Data is attached immediately after calling dot when no worker is used');

    await new Promise(resolve => {
        graphviz
            .render(resolve);
    });

    assert.notEqual(graphviz._data, undefined, 'Data is attached after rendering');

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

    const err = await new Promise(resolve => {
        graphviz
            .onerror(resolve)
            .dot('bad dot 1', callbackThatShouldNotBeCalled)
            .render(callbackThatShouldNotBeCalled);
    });

    assert.equal(
        err,
        "syntax error in line 1 near 'bad'\n",
        'A registered error handler catches syntax errors in the dot source thrown during layout'
    );

    function callbackThatShouldNotBeCalled() {
        assert.error('Callback should not be called when an error occurs');
    }

    global.Worker = undefined;
}

it('dot() performs layout in the foreground when web worker is not used.', async () => {

    await do_test(false, `
            <script src="http://dummyhost/node_modules/@hpcc-js/wasm/dist/index.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );

});

it('dot() performs layout in the foreground with a warning when script src does not contain "@hpcc-js/wasm".', async () => {

    await do_test(true, `
            <script src="http://dummyhost/node_modules/@hpcc-js-NOT/wasm/dist/index.js" type="text/javascript"></script>
            <div id="graph"></div>
            `,
    );

});

it('dot() performs layout in the foreground with a warning when "javascript/worker" script tag does not have a "src" attribute.', async () => {

    await do_test(true, `
            <script type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );

});
