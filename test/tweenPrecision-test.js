var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_transition = require("d3-transition");
var d3_graphviz = require("../");

tape("graphviz().tweenPrecision can be absolute.", function(test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    const length = 100;

    graphviz.tweenPrecision(2);
    const absPrecision = graphviz.options().tweenPrecision;
    test.equal(absPrecision, 2, 'tweenPrecision is 2');

    graphviz
        .tweenShapes(false)
        .tweenPaths(true)
        .zoom(false)
        .on("transitionStart", () => {
            let edge = d3.selectAll('.edge').filter(function(d, i) {
              return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            test.equal(numPoints, 5, 'Number of points on tweened path');
        })
        .on("transitionEnd", () => {
            let edge = d3.selectAll('.edge').filter(function(d, i) {
              return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            test.equal(numPoints, 100 / absPrecision + 2, 'Number points on tweened path');
        })
        .dot('digraph {a -> b; a -> c}')
        .render();
    test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of initial edges');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of initial polygons');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    test.equal(d3.selectAll('path').size(), 2, 'Number of initial paths');
    graphviz
        .dot('digraph {a -> b; a -> c; b -> c}')
        .transition(() => d3_transition.transition().duration(100))
        .fade(false)
        .tweenPaths(true)
        .render()
        .on("end", part1_end);

    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges immediately after rendering');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');

    function part1_end() {

        test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after transition');
        test.equal(d3.selectAll('.edge').size(), 3, 'Number of edges after transition');
        test.equal(d3.selectAll('polygon').size(), 4, 'Number of polygons after transition');
        test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses after transition');
        test.equal(d3.selectAll('path').size(), 3, 'Number of paths after transition');

        test.end();
    }
});


tape("graphviz().tweenPrecision can be relative.", function(test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz.tweenPrecision('20%');
    const precision = graphviz.options().tweenPrecision;
    test.equal(precision, '20%', 'tweenPrecision is 10%');
    const relPrecision = precision.split('%')[0] / 100;
    graphviz
        .tweenShapes(false)
        .tweenPaths(true)
        .zoom(false)
        .on("transitionStart", () => {
            let edge = d3.selectAll('.edge').filter(function(d, i) {
              return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            test.equal(numPoints, 5, 'Number of points on tweened path');
        })
        .on("transitionEnd", () => {
            let edge = d3.selectAll('.edge').filter(function(d, i) {
              return d3.select(this).selectWithoutDataPropagation('title').text() == 'a->c';
            });
            let path = edge.selectWithoutDataPropagation('path');
            const numPoints = path.attr('d').split(/[ A-Za-z]+/).length;
            test.equal(numPoints, 1 / relPrecision + 2, 'Number points on tweened path');
        })
        .dot('digraph {a -> b; a -> c}')
        .render();
    test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of initial edges');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of initial polygons');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    test.equal(d3.selectAll('path').size(), 2, 'Number of initial paths');
    graphviz
        .dot('digraph {a -> b; a -> c; b -> c}')
        .transition(() => d3_transition.transition().duration(100))
        .fade(false)
        .tweenPaths(true)
        .render()
        .on("end", part1_end);

    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges immediately after rendering');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');

    function part1_end() {

        test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after transition');
        test.equal(d3.selectAll('.edge').size(), 3, 'Number of edges after transition');
        test.equal(d3.selectAll('polygon').size(), 4, 'Number of polygons after transition');
        test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses after transition');
        test.equal(d3.selectAll('path').size(), 3, 'Number of paths after transition');

        test.end();
    }
});
