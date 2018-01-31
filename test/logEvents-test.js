var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");
var d3_transition = require("d3-transition");

tape("logEvents enables and disables event logging.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .logEvents(true)
        .dot('digraph {a -> b;}')
        .render();

    var eventTypes = graphviz._eventTypes;
    n = 0;
    for (let i in eventTypes) {
        let eventType = eventTypes[i];
        test.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled");
        n += 1;
    }
    test.ok(n > 10, "More than 10 events are registered when event logging is enabled");
    test.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled");

    graphviz
        .logEvents(false)
        .dot('digraph {a -> b;}')
        .render();

    var eventTypes = graphviz._eventTypes;
    n = 0;
    for (let i in eventTypes) {
        let eventType = eventTypes[i];
        test.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'undefined', "No event named " + eventType + ".log is registered when event logging is disabled");
        n += 1;
    }
    test.ok(n > 10, "None of the more than 10 events are registered when event logging is disabled");
    test.equal(n, eventTypes.length, "None of the " + eventTypes.length + " events are registered when event logging is disabled");

    graphviz
        .zoom(false)
        .logEvents(true)
        .transition(function() {
            return d3_transition.transition().duration(0);
        })
        .dot('digraph {a -> b;}')
        .render()
        .on("end", function () {

            var eventTypes = graphviz._eventTypes;
            n = 0;
            for (let i in eventTypes) {
                let eventType = eventTypes[i];
                test.equal(typeof graphviz._dispatch.on(eventType + ".log"), 'function', "An event named " + eventType + ".log is registered when event logging is enabled and a transition is used");
                n += 1;
            }
            test.ok(n > 10, "More than 10 events are registered when event logging is enabled and a transition is used");
            test.equal(n, eventTypes.length, "All " + eventTypes.length + " events are registered when event logging is enabled and a transition is used");
            test.end();
        });

});
