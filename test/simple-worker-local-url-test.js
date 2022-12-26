import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";
import Worker from "tiny-worker";

tape("Simple rendering an SVG from graphviz DOT.", function(test) {
    var window = global.window = jsdom(
        `
            <script src="test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
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

    var graphviz = d3_graphviz.graphviz("#graph")
        .renderDot('digraph {a -> b;}', checkGraph);

    function checkGraph() {
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
        test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

        graphviz._worker.terminate();
        global.Worker = undefined;
        test.end();
    }
});
