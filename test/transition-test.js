var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_transition = require("d3-transition");
var d3_graphviz = require("../");
var Worker = require("tiny-worker");

tape("graphviz().render() adds and removes SVG elements after transition delay.", function(test) {

    function transition_test_init() {
        var window = global.window = jsdom(
            `
                <script src="node_modules/viz.js/viz.js" type="javascript/worker"></script>
                <div id="graph"></div>
                `,
            {
                url: "http:dummyhost",
            },
        );
        var document = global.document = window.document;
        var Blob = global.Blob = function (jsarray) {
            return new Function(jsarray[0]);
        }
        var createObjectURL = window.URL.createObjectURL = function (js) {
            return js;
        }
        global.Worker = Worker;
    }

    function transition_test(transition1, next_test) {

        var graphviz = d3_graphviz.graphviz("#graph");

        test.equal(graphviz.active(), null, 'No transition is active before a graph has been rendered');

        graphviz
            .on("initEnd", function () {
                part1();
            });

        function part1() {
            graphviz
                .tweenShapes(false)
                .zoom(false)
                .transition(transition1)
                .dot('digraph {a -> b; c}')
                .render(part1_end)
                .on("transitionStart", function () {
                    test.equal(graphviz.active(), null, 'No transition is active before the transition starts');
                })
                .on("transitionEnd", function () {
                    test.ok(graphviz.active() instanceof d3_transition.transition, 'A transition is active just before the transition ends');
                });
        }

        function part1_end() {
            test.equal(graphviz.active(), null, 'No transition is active after the transition ended');
            test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
            test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
            test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
            test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
            test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

            graphviz
                .dot('digraph {a -> b; b -> a}')
                .transition(transition1)
                .fade(false)
                .tweenPaths(false)
                .on("renderEnd", part2_end)
                .on("end", part3_end)
                .render();
        }

        function part2_end() {
            test.equal(graphviz.active(), null, 'No transition is active immediately after the rendering has been initiated');
            test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
            test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
            test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
            test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
            test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
        }

        function part3_end() {

            test.equal(graphviz.active(), null, 'No transition is active after the transition ended');
            test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
            test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
            test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
            test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
            test.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

            if (next_test) {
                graphviz._worker.terminate();
                next_test();
            } else {
                graphviz._worker.terminate();
                global.Worker = undefined;
                test.end();
            }
        }
    }

    function transition_instance_test() {
        transition_test_init();
        transition1 = d3_transition.transition().duration(0);
        transition_test(transition1, transition_function_test);
    }

    function transition_function_test() {
        transition_test_init();
        transition_test(function() {
            return d3_transition.transition().duration(0);
        });
    }

    transition_instance_test();
});
