import assert from "assert";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("logEvents enables and disables event logging.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .zoom(false)
            .logEvents(true)
            .dot('digraph {a -> b;}')
            .render();

        var eventTypes = graphviz._eventTypes;
        var n = 0;
        for (let i in eventTypes) {
            let eventType = eventTypes[i];
            assert.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled");
            n += 1;
        }
        assert.ok(n > 10, "More than 10 events are registered when event logging is enabled");
        assert.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled");

        graphviz
            .logEvents(false)
            .dot('digraph {a -> b;}')
            .render();

        var eventTypes = graphviz._eventTypes;
        n = 0;
        for (let i in eventTypes) {
            let eventType = eventTypes[i];
            assert.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'undefined', "No event named " + eventType + ".log is registered when event logging is disabled");
            n += 1;
        }
        assert.ok(n > 10, "None of the more than 10 events are registered when event logging is disabled");
        assert.equal(n, eventTypes.length, "None of the " + eventTypes.length + " events are registered when event logging is disabled");

        graphviz
            .zoom(false)
            .logEvents(true)
            .transition(function() {
                return d3_transition().duration(0);
            })
            .dot('digraph {a -> b;}')
            .render()
            .on("end", function () {

                var eventTypes = graphviz._eventTypes;
                n = 0;
                for (let i in eventTypes) {
                    let eventType = eventTypes[i];
                    assert.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled and a transition is used");
                    n += 1;
                }
                assert.ok(n > 10, "More than 10 events are registered when event logging is enabled and a transition is used");
                assert.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled and a transition is used");
                resolve();
            });
    }
}));
