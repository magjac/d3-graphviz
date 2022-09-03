import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().addImage() adds images to use in graph.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .zoom(false)
            .addImage("images/first.png", "400px", "300px")
            .addImage("images/second.png", "400px", "300px")
            .renderDot('digraph { a[image="images/first.png"]; b[image="images/second.png"]; a -> b }');

        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');
        assert.equal(d3_selectAll('image').size(), 2, 'Number of images');

        resolve();
    }
}));
