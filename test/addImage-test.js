import assert from "assert";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";


it("graphviz().addImage() adds images to use in graph.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz;
    await new Promise((resolve) => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .zoom(false)
            .addImage("images/first.png", "400px", "300px")
            .addImage("images/second.png", "400px", "300px")
            .renderDot('digraph { a[image="images/first.png"]; b[image="images/second.png"]; a -> b }', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of polygons');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    assert.equal(d3.selectAll('image').size(), 2, 'Number of images');

});
