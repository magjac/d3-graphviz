import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import Worker from "tiny-worker";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="graph"></div>
    `;

it("Simple rendering an SVG from graphviz DOT.", html, () => new Promise(resolve => {
    global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;
    console.log("magjac 100: global.fetch =", global.fetch);
    if (!global.fetch) {
        //        throw "QQQ";
    }

    var graphviz = d3_graphviz("#graph")
        .renderDot('digraph {a -> b;}', checkGraph);

    function checkGraph() {
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

        graphviz._worker.terminate();
        global.Worker = undefined;

        resolve();
    }
}));
