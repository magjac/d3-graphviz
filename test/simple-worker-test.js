var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");
const SharedWorker = require("./polyfill_SharedWorker");

tape("Simple rendering an SVG from graphviz DOT.", function(test) {
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
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz.graphviz("#graph")
        .renderDot('digraph {a -> b;}', checkGraph);

    function checkGraph() {
        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
        test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

        graphviz._worker.port.close();
        global.SharedWorker = undefined;
        test.end();
    }
});
