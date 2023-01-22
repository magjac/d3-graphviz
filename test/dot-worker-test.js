import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import Worker from "tiny-worker";

describe("dot()", () => {
    let graphviz;

    afterEach(() => {
        graphviz._worker.terminate();
        global.Worker = undefined;
    });

    it("dot() performs layout in a web worker in the background.", async () => {

        var window = global.window = jsdom(
            `
                <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
                <div id="graph"></div>
                `,
        );

        global.document = window.document;
        global.Blob = function (jsarray) {
            return new Function(jsarray[0]);
        }
        var createObjectURL = window.URL.createObjectURL = function (js) {
            return js;
        }
        global.Worker = Worker;

        graphviz = d3_graphviz.graphviz("#graph");

        await new Promise(resolve => {
            graphviz
                .on("initEnd", resolve);
        });

        assert.equal(d3.select('#graph').datum(), undefined, 'No data is attached before calling dot');

        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b; c}')

        assert.equal(d3.select('#graph').datum(), undefined, 'No data is attached immediately after calling dot when worker is used');

        await new Promise(resolve => {
            graphviz
                .render(resolve);
        });

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


    });
});
