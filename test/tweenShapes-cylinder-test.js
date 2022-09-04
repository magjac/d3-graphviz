import assert from "assert";
import {selectAll as d3_selectAll} from "d3-selection";
import {transition as d3_transition} from "d3-transition";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().tweenShapes() enables and disables shape tweening during transitions.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .transition(function() { return d3_transition().duration(0)})
            .renderDot('digraph {a}', function () {
                assert.equal(d3_selectAll('.node').size(), 1, 'Number of nodes initially');
                assert.equal(d3_selectAll('.edge').size(), 0, 'Number of edges initially');
                assert.equal(d3_selectAll('g').size(), 2, 'Number of groups initially');
                assert.equal(d3_selectAll('ellipse').size(), 1, 'Number of ellipses initially');
                assert.equal(d3_selectAll('polygon').size(), 1, 'Number of polygons initially');
                assert.equal(d3_selectAll('path').size(), 0, 'Number of paths initially');

                graphviz
                    .renderDot('digraph {a [shape="cylinder"]}', function () {
                        assert.equal(d3_selectAll('.node').size(), 1, 'Number of nodes after shape change to cylinder');
                        assert.equal(d3_selectAll('.edge').size(), 0, 'Number of edges after shape change to cylinder');
                        assert.equal(d3_selectAll('g').size(), 2, 'Number of groups after shape change to cylinder');
                        assert.equal(d3_selectAll('ellipse').size(), 0, 'Number of ellipses after shape change to cylinder');
                        assert.equal(d3_selectAll('polygon').size(), 1, 'Number of polygons after shape change to cylinder');
                        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths after shape change to cylinder');

                        graphviz
                            .renderDot('digraph {a}', function () {
                                assert.equal(d3_selectAll('.node').size(), 1, 'Number of nodes after shape change from cylinder to default');
                                assert.equal(d3_selectAll('.edge').size(), 0, 'Number of edges after shape change from cylinder to default');
                                assert.equal(d3_selectAll('g').size(), 2, 'Number of groups after shape change from cylinder to default');
                                assert.equal(d3_selectAll('ellipse').size(), 1, 'Number of ellipses after shape change from cylinder to default');
                                assert.equal(d3_selectAll('polygon').size(), 1, 'Number of polygons after shape change from cylinder to default');
                                assert.equal(d3_selectAll('path').size(), 0, 'Number of paths after shape change from cylinder to default');

                                resolve();
                            });
                    });
            });
    }
}));
