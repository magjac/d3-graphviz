import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import SharedWorker from "./polyfill_SharedWorker.js";

tape(".destroy() deletes the Graphviz instance from the container element (shared worker version)", async function (test) {
    var window = global.window = jsdom(
        `
            <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
    global.document = window.document;
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz.graphviz("#graph", { useSharedWorker: true });

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}', resolve);
    });


    test.notEqual(d3.select("#graph").node().__graphviz__, undefined,
        'Renderer instance shall exist before destroy');
    graphviz.destroy();
    test.equal(d3.select("#graph").node().__graphviz__, undefined,
        'Renderer instance shall not exist after destroy');

    graphviz._workerPortClose();
    global.SharedWorker = undefined;
    test.end();

});

tape(".destroy() closes the shared worker", async (test) => {

    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz.graphviz("#graph", { useSharedWorker: true });

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}', resolve);
    });

    await new Promise(resolve => {
        let numberOfMessages = 0;
        graphviz._workerPort.onmessage = () => {
            numberOfMessages += 1;
            graphviz.destroy();
            setTimeout(() => {
                graphviz._workerPort.onmessage = () => {
                    numberOfMessages += 1;
                    test.fail('Worker shall not respond after close');
                }
                graphviz._workerPort.postMessage({dot: '', engine: 'dot'});
                test.equal(numberOfMessages, 1,
                           'One message shall have been received');
                graphviz._workerPortClose();
                global.SharedWorker = undefined;
                resolve();
            }, 0);
        };
        graphviz._workerPort.postMessage({dot: '', engine: 'dot'});
    });

    test.end();
});
