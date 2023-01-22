import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().tweenPaths(true) enables path tweening during transitions.", async () => {

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

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of initial ellipses');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    const transition1 = d3_transition.transition().duration(100);

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; b -> a}')
            .transition(transition1)
            .fade(false)
            .tweenPaths(true)
            .render()
            .on("end", resolve);

        assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
        assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');
        assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons immediately after rendering');
        assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses immediately after rendering');
        assert.equal(d3.selectAll('path').size(), 2, 'Number of paths immediately after rendering');
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');
    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after transition');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after transition');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths after transition');

});
