import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import SharedWorker from "./polyfill_SharedWorker.js";

describe("renderDot()", () => {
    let graphviz;

    afterEach(() => {
        graphviz._workerPortClose();
        global.SharedWorker = undefined;
    });

    tape("Simple rendering an SVG from graphviz DOT.", function (test) {
        var window = global.window = jsdom(
            `
                <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
                <div id="graph"></div>
                `,
        );
        var document = global.document = window.document;
        global.SharedWorker = SharedWorker;

        graphviz = d3_graphviz.graphviz("#graph", { useSharedWorker: true })
            .renderDot('digraph {a -> b;}', checkGraph);

        function checkGraph() {
            test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
            test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
            test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
            test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
            test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

            test.end();
        }
    });
});
