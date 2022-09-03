import assert from "assert";
import {select as d3_select} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it(".destroy() deletes the Graphviz instance from the container element (worker version)", html, () => new Promise(resolve => {

    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph", {useWorker: true})
        .renderDot('digraph {a -> b;}', destroy);

    function destroy() {

        assert.notEqual(d3_select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall exist before destroy');
        graphviz.destroy();
        assert.equal(d3_select("#graph").node().__graphviz__, undefined,
                       'Renderer instance shall not exist after destroy');

        graphviz._workerPortClose();
        global.Worker = undefined;

        resolve();
    }
            }));

it(".destroy() closes the worker",  html, () => new Promise(resolve => {
    var Blob = global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    var createObjectURL = window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph", {useWorker: true})
        .renderDot('digraph {a -> b;}', destroy);

    function destroy() {

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
    }
}));
