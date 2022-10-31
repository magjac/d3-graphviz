import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

async function do_test(useWorker) {
    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph", useWorker);
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

    assert.equal(d3_selectAll('.node').size(), 3, 'Number of initial nodes');
    assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3_selectAll('polygon').size(), 2, 'Number of initial polygons');
    assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');

        graphviz
            .dot('bad dot 1', callbackThatShouldNotBeCalled)
            .render(callbackThatShouldNotBeCalled);
    }

    function callbackThatShouldNotBeCalled() {
        assert.error('Callback should not be called when an error occurs');
    }

    global.Worker = undefined;
    resolve();
}

let html = `
    <script src="http://dummyhost/node_modules/@hpcc-js/wasm/dist/index.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it('dot() performs layout in the foreground when web worker is not used.', html, async () => {

    do_test(false, resolve);
}));

html = `
    <script src="http://dummyhost/node_modules/@hpcc-js-NOT/wasm/dist/index.js" type="text/javascript"></script>
    <div id="graph"></div>
    `;

it('dot() performs layout in the foreground with a warning when script src does not contain "@hpcc-js/wasm".', html, () => new Promise(resolve => {
    do_test(true, resolve);
}));

html = `
    <script type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it('dot() performs layout in the foreground with a warning when "javascript/worker" script tag does not have a "src" attribute.', html, () => new Promise(resolve => {
    do_test(true, resolve);
}));
