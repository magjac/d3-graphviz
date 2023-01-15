import tape from "./tape.js";
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

    tape("graphviz().render() adds and removes SVG elements after transition delay.", async function (test) {

        function transition_test_init() {
            var window = global.window = jsdom(
                `
                    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
                    <div id="graph"></div>
                    `,
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

        async function transition_test(transition1) {
            await new Promise(async resolve0 => {

                graphviz = d3_graphviz.graphviz("#graph");

                test.equal(graphviz.active(), null, 'No transition is active before a graph has been rendered');

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
                            test.equal(graphviz.active(), null, 'No transition is active before the transition starts');
                        })
                        .on("transitionEnd", function () {
                            test.ok(graphviz.active() instanceof d3_transition.transition, 'A transition is active just before the transition ends');
                        });
                });

                test.equal(graphviz.active(), null, 'No transition is active after the transition ended');
                test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
                test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
                test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
                test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
                test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

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
                    test.equal(graphviz.active(), null, 'No transition is active immediately after the rendering has been initiated');
                    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
                    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
                    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
                    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
                    test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
                }

                test.equal(graphviz.active(), null, 'No transition is active after the transition ended');
                test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
                test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
                test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
                test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
                test.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

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

        test.end();
    });
});
