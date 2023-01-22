import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";
import * as d3_transition from "d3-transition";
import Worker from "tiny-worker";

describe("logEvents())", () => {
    let graphviz;

    afterEach(() => {
        graphviz._worker.terminate();
        global.Worker = undefined;
    });

    it("logEvents enables event logging using web worker.", async () => {
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

        await new Promise(resolve => {
            graphviz = d3_graphviz.graphviz("#graph")
                .zoom(false)
                .logEvents(true)
                .renderDot('digraph {a -> b}')
                .on("initEnd", resolve);
        });

        var eventTypes = graphviz._eventTypes;
        var n = 0;
        for (let i in eventTypes) {
            let eventType = eventTypes[i];
            assert.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled");
            n += 1;
        }
        assert.ok(n > 10, "More than 10 events are registered when event logging is enabled");
        assert.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled");

        await new Promise(resolve => {
            graphviz.on("end", resolve);
        });

    });
});
