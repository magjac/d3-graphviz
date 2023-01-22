import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().render() adds and removes SVG elements after transition delay.", async () => {

    var window = global.window = jsdom('<div id="graph"><div id="dummy">Hello World</div></div>');
    global.document = window.document

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .logEvents(true)
            .on('initEnd', resolve);
    });

    assert.equal(graphviz.active(), null, 'No transition is active before a graph has been rendered');

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .transition(d3_transition.transition().duration(0))
            .dot('digraph {a -> b; c; d}')
            .render();

        assert.ok(graphviz._active, 'Rendering is active after the 1st rendering has been initiated');

        assert.equal(d3.selectAll('.node').size(), 4, 'Number of initial nodes');
        assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
        assert.equal(d3.selectAll('ellipse').size(), 4, 'Number of initial ellipses');
        assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

        graphviz
            .dot('digraph {a -> b; b -> a}')
            .transition(d3_transition.transition().duration(100))
            .on("end", resolve)
            .render();

        assert.equal(d3.selectAll('.node').size(), 4, 'Number of nodes immediately after 2nd rendering has been initiated while 1st is not yet finished');
        assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after 2nd rendering has been initiated while 1st is not yet finished');
        assert.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons immediately after 2nd rendering has been initiated while 1st is not yet finished');
        assert.equal(d3.selectAll('ellipse').size(), 4, 'Number of ellipses immediately after 2nd rendering has been initiated while 1st is not yet finished');
        assert.equal(d3.selectAll('path').size(), 1, 'Number of paths immediately after 2nd rendering has been initiated while 1st is not yet finished');
    });

    assert.ok(graphviz._active, 'Rendering is still active after the 1st rendering has finished, but 2nd has not');

    assert.equal(d3.selectAll('.node').size(), 4, 'Number of nodes after 1st transition');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after 1st transition');
    assert.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after 1st transition');
    assert.equal(d3.selectAll('ellipse').size(), 4, 'Number of ellipses after 1st transition');
    assert.equal(d3.selectAll('path').size(), 4, 'Number of paths after 1st transition');

    await new Promise(resolve => {
        graphviz
            .on("end", resolve);
    });

    assert.equal(graphviz._active, false, 'Rendering is not active after the 2nd rendering has finished');

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after 2nd transition');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after 2nd transition');
    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after 2nd transition');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after 2nd transition');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths after 2nd transition');

});
