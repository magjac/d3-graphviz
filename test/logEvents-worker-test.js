import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it("logEvents enables event logging using web worker.", html, () => new Promise(resolve => {
    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz("#graph")
        .zoom(false)
        .logEvents(true)
        .renderDot('digraph {a -> b}')
        .on("initEnd", checkEventLogging);

    function checkEventLogging() {
        var eventTypes = graphviz._eventTypes;
        var n = 0;
        for (let i in eventTypes) {
            let eventType = eventTypes[i];
            assert.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled");
            n += 1;
        }
        assert.ok(n > 10, "More than 10 events are registered when event logging is enabled");
        assert.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled");
        graphviz.on("end", () => {
            graphviz._worker.terminate();
            global.Worker = undefined;
            resolve();
        });
    }
}));
