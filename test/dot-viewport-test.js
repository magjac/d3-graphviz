var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

var simpleWidth = 62;
var simpleHeight = 116;
var margin = 4;
var bbWidth = simpleWidth - margin * 2;
var bbHeight = simpleHeight - margin * 2;

tape("DOT without viewport", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var scale = 1;

    var dot = `
        digraph {
            graph[viewport="${simpleWidth},${simpleHeight},${scale}"]
            a -> b
        }
    `;


    graphviz
        .renderDot(dot);

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.equal(d3.select('g').attr("transform"), 'translate(4,112) scale(1)', 'transform attribute');

    test.end();
});

tape("DOT with viewport scale 2", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var scale = 2;

    var dot = `
        digraph {
            graph[viewport="${simpleWidth * scale},${simpleHeight * scale},${scale}"]
            a -> b
        }
    `;


    graphviz
        .renderDot(dot);

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.equal(d3.select('g').attr("transform"), 'translate(4,112) scale(2)', 'transform attribute');

    test.end();
});

tape("DOT with viewport scale 0.5", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var scale = 0.5;

    var dot = `
        digraph {
            graph[viewport="${simpleWidth * scale},${simpleHeight * scale},${scale}"]
            a -> b
        }
    `;


    graphviz
        .renderDot(dot);

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.equal(d3.select('g').attr("transform"), 'translate(4,112) scale(0.5)', 'transform attribute');

    test.end();
});

tape("DOT with viewport scale 1.5", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var scale = 1.5;

    var dot = `
        digraph {
            graph[viewport="${simpleWidth * scale},${simpleHeight * scale},${scale}"]
            a -> b
        }
    `;


    graphviz
        .renderDot(dot);

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.equal(d3.select('g').attr("transform"), 'translate(4,112) scale(1.5)', 'transform attribute');

    test.end();
});

tape("DOT with viewport scale 2 and original size", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var scale = 2;

    var dot = `
        digraph {
            graph[viewport="${simpleWidth},${simpleHeight},${scale}"]
            a -> b
        }
    `;


    graphviz
        .renderDot(dot);

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    test.equal(d3.select('g').attr("transform"), 'translate(-11.5,83) scale(2)', 'transform attribute');

    test.end();
});
