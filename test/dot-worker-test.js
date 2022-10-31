import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it("dot() performs layout in a web worker in the background.", html, () => new Promise(resolve => {

    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b; c}')

    assert.equal(d3_select('#graph').datum(), undefined, 'No data is attached immediately after calling dot when worker is used');

    await new Promise(resolve => {
        graphviz
            .render(resolve);
    });

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
        graphviz._worker.terminate();
        global.Worker = undefined;
        resolve();
    }
}));
