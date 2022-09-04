import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

var simpleWidth = 62;
var simpleHeight = 116;
var margin = 4;
var bbWidth = simpleWidth - margin * 2;
var bbHeight = simpleHeight - margin * 2;

const html = '<div id="graph"></div>';

it("DOT without viewport", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', () => {

            var scale = 1;

            var dot = `
                digraph {
                    graph[viewport="${simpleWidth},${simpleHeight},${scale}"]
                    a -> b
                }
            `;


            graphviz
                .renderDot(dot);

            assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
            assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
            assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
            assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
            assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

            assert.equal(d3_select('g').attr("transform"), 'translate(4,112) scale(1)', 'transform attribute');

            resolve();
        });
}));

it("DOT with viewport scale 2", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', () => {

            var scale = 2;

            var dot = `
                digraph {
                    graph[viewport="${simpleWidth * scale},${simpleHeight * scale},${scale}"]
                    a -> b
                }
            `;


            graphviz
                .renderDot(dot);

            assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
            assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
            assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
            assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
            assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

            assert.equal(d3_select('g').attr("transform"), 'translate(4,112) scale(2)', 'transform attribute');

            resolve();
        });
}));

it("DOT with viewport scale 0.5", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', () => {

            var scale = 0.5;

            var dot = `
                digraph {
                    graph[viewport="${simpleWidth * scale},${simpleHeight * scale},${scale}"]
                    a -> b
                }
            `;


            graphviz
                .renderDot(dot);

            assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
            assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
            assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
            assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
            assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

            assert.equal(d3_select('g').attr("transform"), 'translate(4,112) scale(0.5)', 'transform attribute');

            resolve();
        });
}));

it("DOT with viewport scale 1.5", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', () => {

        var scale = 1.5;

        var dot = `
            digraph {
                graph[viewport="${simpleWidth * scale},${simpleHeight * scale},${scale}"]
                a -> b
            }
        `;


        graphviz
            .renderDot(dot);

        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

        assert.equal(d3_select('g').attr("transform"), 'translate(4,112) scale(1.5)', 'transform attribute');

        resolve();
        });
}));

it("DOT with viewport scale 2 and original size", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on('initEnd', () => {

            var scale = 2;

            var dot = `
                digraph {
                    graph[viewport="${simpleWidth},${simpleHeight},${scale}"]
                    a -> b
                }
            `;


            graphviz
                .renderDot(dot);

            assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes');
            assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges');
            assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
            assert.equal(d3_selectAll('polygon').size(), 2, 'Number of polygons');
            assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');

            assert.equal(d3_select('g').attr("transform"), 'translate(-11.5,83) scale(2)', 'transform attribute');

            resolve();
        });
}));
