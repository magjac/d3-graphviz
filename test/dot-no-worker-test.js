import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

function do_test(useWorker, resolve) {
    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph", useWorker)
        .on('initEnd', () => {

            assert.equal(graphviz._data, undefined, 'No data is attached before calling dot');
            graphviz
                .tweenShapes(false)
                .zoom(false)
                .onerror(handleError)
                .dot('digraph {a -> b; c}');

            assert.notEqual(graphviz._data, undefined, 'Data is attached immediately after calling dot when no worker is used');
            graphviz
                .render(part1_end);
        });

    function handleError(err) {
        assert.equal(
            err,
            "syntax error in line 1 near 'bad'\n",
            'A registered error handler catches syntax errors in the dot source thrown during layout'
        );
        part2();
    }

    function part1_end() {
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

    function part2() {
        global.Worker = undefined;
        resolve();
    }
}

let html = `
    <script src="http://dummyhost/node_modules/@hpcc-js/wasm/dist/index.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it('dot() performs layout in the foreground when web worker is not used.', html, () => new Promise(resolve => {

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
