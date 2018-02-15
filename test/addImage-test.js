var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_graphviz = require("../");

tape("graphviz().tweenPaths(true) enables path tweening during transitions.", function(test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .addImage("images/first.png", "400px", "300px")
        .addImage("images/second.png", "400px", "300px")
        .renderDot('digraph { a[image="images/first.png"]; b[image="images/second.png"]; a -> b }');

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    test.equal(d3.selectAll('image').size(), 2, 'Number of images');

    test.end();

});
