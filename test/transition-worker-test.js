import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";
import Worker from "tiny-worker";

describe("render()", () => {
    let graphviz;

    afterEach(() => {
        graphviz._worker.terminate();
        global.Worker = undefined;
    });

    it("graphviz().render() adds and removes SVG elements after transition delay.", async () => {

        function transition_test_init() {
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
        }

        async function transition_test(transition1) {
            await new Promise(async resolve0 => {

                graphviz = d3_graphviz.graphviz("#graph");

                assert.equal(graphviz.active(), null, 'No transition is active before a graph has been rendered');

                await new Promise(resolve => {
                    graphviz
                        .on("initEnd", resolve);
                });

                await new Promise(resolve => {
                    graphviz
                        .tweenShapes(false)
                        .zoom(false)
                        .transition(transition1)
                        .dot('digraph {a -> b; c}')
                        .render(resolve)
                        .on("transitionStart", function () {
                            assert.equal(graphviz.active(), null, 'No transition is active before the transition starts');
                        })
                        .on("transitionEnd", function () {
                            assert.ok(graphviz.active() instanceof d3_transition.transition, 'A transition is active just before the transition ends');
                        });
                });

                assert.equal(graphviz.active(), null, 'No transition is active after the transition ended');
                assert.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
                assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
                assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
                assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
                assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

                await new Promise(resolve => {
                    graphviz
                        .dot('digraph {a -> b; b -> a}')
                        .transition(transition1)
                        .fade(false)
                        .tweenPaths(false)
                        .on("renderEnd", part2_end)
                        .on("end", resolve)
                        .render();
                });

                function part2_end() {
                    assert.equal(graphviz.active(), null, 'No transition is active immediately after the rendering has been initiated');
                    assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
                    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
                    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
                    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
                    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
                }

                assert.equal(graphviz.active(), null, 'No transition is active after the transition ended');
                assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
                assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
                assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
                assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
                assert.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

                graphviz.destroy();

                resolve0();
            });
        }

        transition_test_init();
        await transition_test(null);

        transition_test_init();
        await transition_test(function () {
            return d3_transition.transition().duration(0);
        });

    });
});
