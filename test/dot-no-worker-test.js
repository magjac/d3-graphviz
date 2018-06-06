var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");
var Worker = require("tiny-worker");

function do_test(test, useWorker, html) {
    var window = global.window = jsdom(html);
    var document = global.document = window.document;
    var Blob = global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    var createObjectURL = window.URL.createObjectURL = function (js) {
        return js;
    }
    global.Worker = Worker;

    var graphviz = d3_graphviz.graphviz("#graph", useWorker);

    graphviz
        .logEvents(true);

    function handleError(err) {
        test.equal(
            err,
            "syntax error in line 1 near 'bad'\n",
            'A registered error handler catches syntax errors in the dot source thrown during layout'
        );
        part2();
    }

    test.equal(graphviz._data, undefined, 'No data is attached before calling dot');
    graphviz
        .tweenShapes(false)
        .zoom(false)
        .onerror(handleError)
        .dot('digraph {a -> b; c}');

    test.notEqual(graphviz._data, undefined, 'Data is attached immediately after calling dot when no worker is used');
    graphviz
        .render(part1_end);

    function part1_end() {
        test.notEqual(graphviz._data, undefined, 'Data is attached after rendering');
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
        global.Worker = undefined;
        test.end();
    }
}

tape('dot() performs layout in the foreground when web worker is not used.', function(test) {

    do_test(test=test, false, html=`
            <script src="http://dummyhost/node_modules/viz.js/viz.js" type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
});

tape('dot() performs layout in the foreground with a warning when script src does not end with "viz.js".', function(test) {

    do_test(test=test, true, html=`
            <script src="http://dummyhost/node_modules/viz.js/viz-NOT.js" type="text/javascript"></script>
            <div id="graph"></div>
            `,
    );
});

tape('dot() performs layout in the foreground with a warning when "javascript/worker" script tag does not have a "src" attribute.', function(test) {

    do_test(test=test, true, html=`
            <script type="javascript/worker"></script>
            <div id="graph"></div>
            `,
    );
});
