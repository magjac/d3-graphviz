import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import SharedWorker from "./polyfill_SharedWorker.js";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it("Simple rendering an SVG from graphviz DOT (shared woker version).", html, () => new Promise(resolve => {
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz("#graph", {useSharedWorker: true})
        .renderDot('digraph {a -> b;}', checkGraph);

    function checkGraph() {
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

        graphviz._workerPortClose();
        global.SharedWorker = undefined;

        resolve();
    }
}));
