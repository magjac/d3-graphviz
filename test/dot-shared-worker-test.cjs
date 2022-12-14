var tape = require("./tape.cjs");
var jsdom = require("./jsdom.cjs");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var SharedWorker = require("./polyfill_SharedWorker.cjs");
tape("dot() performs layout in a web worker in the background.", function(test) {

    var window = global.window = jsdom(
        `
            <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );

    var document = global.document = window.document;
    global.SharedWorker = SharedWorker;

    var graphviz = d3_graphviz.graphviz("#graph", {useSharedWorker: true});

    graphviz
        .on("initEnd", function () {
            part1();
        });

    function handleError(err) {
        test.equal(
            err,
            "syntax error in line 1 near 'bad'\n",
            'A registered error handler catches syntax errors in the dot source thrown during layout'
        );
        part2();
    }

    test.equal(d3.select('#graph').datum(), undefined, 'No data is attached before calling dot');
    function part1() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .onerror(handleError)
            .dot('digraph {a -> b; c}')
            .render(part1_end);
    }
    test.equal(d3.select('#graph').datum(), undefined, 'No data is attached immediately after calling dot when worker is used');

    function part1_end() {
        test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

        graphviz
            .dot('bad dot 1', callbackThatShouldNotBeCalled)
            .render(callbackThatShouldNotBeCalled);
    }

    function callbackThatShouldNotBeCalled() {
        test.error('Callback should not be called when an error occurs');
    }

    function part2() {
        graphviz._workerPortClose(),
        global.SharedWorker = undefined;
        test.end();
    }
});
