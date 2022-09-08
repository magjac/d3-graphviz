import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="text/javascript"></script>
    <div id="graph"></div>
    `;

it("dot() performs layout in a web worker in the background with text/javascript tag.", html, () => new Promise(resolve => {

    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph");

    graphviz
        .on("initEnd", function () {
            part1();
        });

    function handleError(err) {
        assert.equal(
            err,
            "syntax error in line 1 near 'bad'\n",
            'A registered error handler catches syntax errors in the dot source thrown during layout'
        );
        part2();
    }

    assert.equal(d3_select('#graph').datum(), undefined, 'No data is attached before calling dot');
    function part1() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .onerror(handleError)
            .dot('digraph {a -> b; c}')
            .render(part1_end);
    }
    assert.equal(d3_select('#graph').datum(), undefined, 'No data is attached immediately after calling dot when worker is used');

    function part1_end() {
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
