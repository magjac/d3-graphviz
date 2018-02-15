var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_transition = require("d3-transition");
var d3_graphviz = require("../");

tape("graphviz().render() adds and removes SVG elements after transition delay.", function(test) {

    var window = global.window = jsdom('<div id="graph"><div id="dummy">Hello World</div></div>');
    var document = global.document = window.document;

    var graphviz = d3_graphviz.graphviz("#graph");

    test.equal(graphviz.active(), null, 'No transition is active before a graph has been rendered');

    graphviz
        .zoom(false)
        .transition(d3_transition.transition().duration(0))
        .dot('digraph {a -> b; c; d}')
        .render();

        test.ok(graphviz._active, 'Rendering is active after the 1st rendering has been initiated');

        test.equal(d3.selectAll('.node').size(), 4, 'Number of initial nodes');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
        test.equal(d3.selectAll('ellipse').size(), 4, 'Number of initial ellipses');
        test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

        graphviz
            .dot('digraph {a -> b; b -> a}')
            .transition(d3_transition.transition().duration(0))
            .on("end", part1_end)
            .render();

        test.equal(d3.selectAll('.node').size(), 4, 'Number of nodes immediately after 2nd rendering has been initiated while 1st is not yet finished');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after 2nd rendering has been initiated while 1st is not yet finished');
        test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons immediately after 2nd rendering has been initiated while 1st is not yet finished');
        test.equal(d3.selectAll('ellipse').size(), 4, 'Number of ellipses immediately after 2nd rendering has been initiated while 1st is not yet finished');
        test.equal(d3.selectAll('path').size(), 1, 'Number of paths immediately after 2nd rendering has been initiated while 1st is not yet finished');

    function part1_end() {

        test.ok(graphviz._active, 'Rendering is still active after the 1st rendering has finished, but 2nd has not');

        test.equal(d3.selectAll('.node').size(), 4, 'Number of nodes after 1st transition');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after 1st transition');
        test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after 1st transition');
        test.equal(d3.selectAll('ellipse').size(), 4, 'Number of ellipses after 1st transition');
        test.equal(d3.selectAll('path').size(), 4, 'Number of paths after 1st transition');

        graphviz
            .on("end", part2_end)
    }

    function part2_end() {

        test.notOk(graphviz._active, 'Rendering is not active after the 2nd rendering has finished');

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after 2nd transition');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after 2nd transition');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after 2nd transition');
        test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after 2nd transition');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths after 2nd transition');

        test.end();
    }


});
