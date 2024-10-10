import assert from "assert";
import it from "./it.js";
import { it_xfail } from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("Simple rendering an SVG from graphviz DOT with rotate=90 and zoom disabled.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .zoom(false)
            .renderDot('digraph {rotate=90; a -> b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    assert.equal(d3.select('#graph0').attr("transform"), "scale(1 1) rotate(-90) translate(-58 112)");
});

it_xfail("Simple rendering an SVG from graphviz DOT with rotate=90 and zoom enabled.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .zoom(true)
            .renderDot('digraph {rotate=90; a -> b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    assert.equal(d3.select('#graph0').attr("transform"), "rotate(-90) translate(-58 112) scale(1)");
});
