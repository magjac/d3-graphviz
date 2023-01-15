import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

tape("graphviz().tweenPaths(true) enables path tweening during transitions.", async function (test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    var graphviz;


    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on('initEnd', resolve);
    });

    graphviz
        .tweenShapes(false)
        .tweenPaths(true)
        .tweenPrecision(4)
        .zoom(false)
        .dot('digraph {a -> b; c}')
        .render();

    test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    const transition1 = d3_transition.transition().duration(100);

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .transition(transition1)
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", resolve);

        test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
        test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        test.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    });

    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

    test.end();
});
