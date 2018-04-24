var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_transition = require("d3-transition");
var d3_graphviz = require("../");

tape("graphviz().tweenShapes() enables and disables shape tweening during transitions.", function(test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .transition(function() { return d3_transition.transition().duration(0)})
        .renderDot('digraph {a}', function () {
            test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes initially');
            test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges initially');
            test.equal(d3.selectAll('g').size(), 2, 'Number of groups initially');
            test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses initially');
            test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons initially');
            test.equal(d3.selectAll('path').size(), 0, 'Number of paths initially');

            graphviz
                .renderDot('digraph {a [shape="cylinder"]}', function () {
                    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after shape change to cylinder');
                    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after shape change to cylinder');
                    test.equal(d3.selectAll('g').size(), 2, 'Number of groups after shape change to cylinder');
                    test.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after shape change to cylinder');
                    test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after shape change to cylinder');
                    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after shape change to cylinder');

                    graphviz
                        .renderDot('digraph {a}', function () {
                            test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after shape change from cylinder to default');
                            test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after shape change from cylinder to default');
                            test.equal(d3.selectAll('g').size(), 2, 'Number of groups after shape change from cylinder to default');
                            test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change from cylinder to default');
                            test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after shape change from cylinder to default');
                            test.equal(d3.selectAll('path').size(), 0, 'Number of paths after shape change from cylinder to default');

                            test.end();
                        });
                });
        });
});
