var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");
const SharedWorker = require("./polyfill_SharedWorker");

tape(".destroy() deletes the Graphviz instance from the container element", function(test) {
    var window = global.window = jsdom(
        `
            <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
    var document = global.document = window.document;
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz.graphviz("#graph")
        .renderDot('digraph {a -> b;}', destroy);

    function destroy() {

        test.notEqual(d3.select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall exist before destoy');
        graphviz.destroy();
        test.equal(d3.select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall not exist after destoy');

        graphviz._worker.port.close();
        global.SharedWorker = undefined;
        test.end();
    }
});

tape(".destroy() closes the shared worker", function(test) {
    var window = global.window = jsdom(
        `
            <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
    var document = global.document = window.document;
    var Blob = global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    var createObjectURL = window.URL.createObjectURL = function (js) {
        return js;
    }
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz.graphviz("#graph")
        .renderDot('digraph {a -> b;}', destroy);

    function destroy() {

        let numberOfMessages = 0;
        graphviz._worker.port.onmessage = () => {
            graphviz.destroy();
            graphviz._worker.port.onmessage = () => {
                test.fail('Worker shall not respond after close');
                graphviz._worker.port.close();
              }
            graphviz._worker.port.postMessage('');
            global.SharedWorker = undefined;
            test.end();
        };
        graphviz._worker.port.postMessage('', () => {});
    }
});
