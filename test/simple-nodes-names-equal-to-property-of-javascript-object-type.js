import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("Simple rendering of an edge between two nodes with names equal to a property of the JavaScript Object type.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;

    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .growEnteringEdges(true)
            .onerror(e => {
                console.log("graphviz.renderDot error:", e);
               resolve(false);
             })
            .renderDot('digraph {constructor -> toString}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');
});
