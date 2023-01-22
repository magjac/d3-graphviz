import assert from "assert";
import it from "./it.js";
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

    it("Simple rendering an SVG from graphviz DOT.", async () => {
        var window = global.window = jsdom(
            `
                <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
                <div id="graph"></div>
                `,
        );
        var document = global.document = window.document;
        global.SharedWorker = SharedWorker;


        await new Promise(resolve => {
            graphviz = d3_graphviz.graphviz("#graph", { useSharedWorker: true })
                .renderDot('digraph {a -> b;}', resolve);
        });

        assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
        assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
        assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
        assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    });
});
