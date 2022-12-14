var tape = require("./tape.cjs");
var jsdom = require("./jsdom.cjs");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");
var Worker = require("tiny-worker");

tape("logEvents enables event logging using web worker.", function(test) {
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

    var graphviz = d3_graphviz.graphviz("#graph")
        .zoom(false)
        .logEvents(true)
        .renderDot('digraph {a -> b}')
        .on("initEnd", checkEventLogging);

    function checkEventLogging() {
        var eventTypes = graphviz._eventTypes;
        var n = 0;
        for (let i in eventTypes) {
            let eventType = eventTypes[i];
            test.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled");
            n += 1;
        }
        test.ok(n > 10, "More than 10 events are registered when event logging is enabled");
        test.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled");
        graphviz.on("end", () => {
            graphviz._worker.terminate();
            global.Worker = undefined;
            test.end();
        });
    }
});
