import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it("graphviz().render() adds and removes SVG elements after transition delay.", html, () => new Promise(resolve => {

    function transition_test_init() {
        global.Blob = function (jsarray) {
            return new Function(jsarray[0]);
        }
        window.URL.createObjectURL = function (js) {
            return js;
        }
        global.Worker = Worker;
    }

    function transition_test(transition1, next_test) {

        var graphviz = d3_graphviz("#graph");

        assert.equal(graphviz.active(), null, 'No transition is active before a graph has been rendered');

        graphviz
            .on("initEnd", function () {
                part1();
            });

        const transition2 = transition1 || d3_transition().duration(1000);
        function part1() {
            graphviz
                .tweenShapes(false)
                .zoom(false)
                .transition(transition1)
                .dot('digraph {a -> b; c}')
                .render(part1_end)
                .on("transitionStart", function () {
                    assert.equal(graphviz.active(), null, 'No transition is active before the transition starts');
                })
                .on("transitionEnd", function () {
                    assert.ok(graphviz.active() instanceof d3_transition, 'A transition is active just before the transition ends');
                });
        }

        function part1_end() {
            assert.equal(graphviz.active(), null, 'No transition is active after the transition ended');
            assert.equal(d3_selectAll('.node').size(), 3, 'Number of initial nodes');
            assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
            assert.equal(d3_selectAll('polygon').size(), 2, 'Number of initial polygons');
            assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of initial ellipses');
            assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');

            const transition2 = transition1 || d3_transition().duration(1000);
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
            assert.equal(graphviz.active(), null, 'No transition is active immediately after the rendering has been initiated');
            assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
            assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
            assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
            assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
            assert.equal(d3_selectAll('path').size(), 2, 'Number of paths immediately after rendering');
        }

        function part3_end() {

            assert.equal(graphviz.active(), null, 'No transition is active after the transition ended');
            assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes after transition');
            assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after transition');
            assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons after transition');
            assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
            assert.equal(d3_selectAll('path').size(), 2, 'Number of paths after transition');

            if (next_test) {
                graphviz.destroy();
                next_test();
            } else {
                graphviz._worker.terminate();
                global.Worker = undefined;
                resolve();
            }
        }
    }

    function transition_instance_test() {
        transition_test_init();
        transition_test(null, transition_function_test);
    }

    function transition_function_test() {
        transition_test_init();
        transition_test(function() {
            return d3_transition().duration(0);
        });
    }

    transition_instance_test();
}));
