import tape from "./tape.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

tape("graphviz().tweenShapes() enables and disables shape tweening during transitions.", async function (test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

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

    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes initially');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges initially');
    test.equal(d3.selectAll('g').size(), 2, 'Number of groups initially');
    test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses initially');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons initially');
    test.equal(d3.selectAll('path').size(), 0, 'Number of paths initially');

    await new Promise(resolve => {
        graphviz
                    .renderDot('digraph {a [shape="cylinder"]}', resolve);
     });

    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after shape change to cylinder');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after shape change to cylinder');
    test.equal(d3.selectAll('g').size(), 2, 'Number of groups after shape change to cylinder');
    test.equal(d3.selectAll('ellipse').size(), 0, 'Number of ellipses after shape change to cylinder');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after shape change to cylinder');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after shape change to cylinder');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {a}', resolve);
    });

    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after shape change from cylinder to default');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after shape change from cylinder to default');
    test.equal(d3.selectAll('g').size(), 2, 'Number of groups after shape change from cylinder to default');
    test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change from cylinder to default');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after shape change from cylinder to default');
    test.equal(d3.selectAll('path').size(), 0, 'Number of paths after shape change from cylinder to default');

    test.end();
});
