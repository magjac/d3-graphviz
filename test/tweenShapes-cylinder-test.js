import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().tweenShapes() enables and disables shape tweening during transitions.", async () => {

    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .transition(function() { return d3_transition.transition().duration(0)})
            .renderDot('digraph {a}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of nodes initially');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges initially');
    assert.equal(d3.selectAll('g').size(), 2, 'Number of groups initially');
    assert.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses initially');
    assert.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons initially');
    assert.equal(d3.selectAll('path').size(), 0, 'Number of paths initially');

    await new Promise(resolve => {
        graphviz
                    .renderDot('digraph {a [shape="cylinder"]}', resolve);
     });

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after shape change to cylinder');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after shape change to cylinder');
    assert.equal(d3.selectAll('g').size(), 2, 'Number of groups after shape change to cylinder');
    assert.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after shape change to cylinder');
    assert.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after shape change to cylinder');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths after shape change to cylinder');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after shape change from cylinder to default');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after shape change from cylinder to default');
    assert.equal(d3.selectAll('g').size(), 2, 'Number of groups after shape change from cylinder to default');
    assert.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change from cylinder to default');
    assert.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after shape change from cylinder to default');
    assert.equal(d3.selectAll('path').size(), 0, 'Number of paths after shape change from cylinder to default');

});
