import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import Worker from "tiny-worker";

it(".destroy() deletes the Graphviz instance from the container element (worker version)", async () => {
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
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz.graphviz("#graph", {useWorker: true});
    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a -> b;}', resolve);
    })

    assert.notEqual(d3.select("#graph").node().__graphviz__, undefined,
        'Renderer instance shall exist before destroy');
    graphviz.destroy();
    assert.equal(d3.select("#graph").node().__graphviz__, undefined,
        'Renderer instance shall not exist after destroy');

    graphviz._workerPortClose();
    global.Worker = undefined;
});

it(".destroy() closes the worker", async () => {
    var window = global.window = jsdom(
        `
            <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
    global.document = window.document;
    var Blob = global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    var createObjectURL = window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz.graphviz("#graph", {useWorker: true});

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
                    assert.fail('Worker shall not respond after close');
                }
                graphviz._workerPort.postMessage({dot: '', engine: 'dot'});
                assert.equal(numberOfMessages, 1,
                           'One message shall have been received');
                graphviz._workerPortClose();
                global.Worker = undefined;
                resolve();
            }, 100);
        };
        graphviz._workerPort.postMessage({dot: '', engine: 'dot'});
    });
});
