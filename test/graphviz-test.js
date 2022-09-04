import assert from "assert";
import {select as d3_select} from "d3-selection";
import {selectAll as d3_selectAll} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz().render() renders an SVG from graphviz DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        const svgDoc = `<svg width="62pt" height="116pt" viewBox="0.00 0.00 62.00 116.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 112)">
<polygon fill="white" stroke="none" points="-4,4 -4,-112 58,-112 58,4 -4,4"></polygon>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="black" cx="27" cy="-90" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>b</title>
<ellipse fill="none" stroke="black" cx="27" cy="-18" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00">b</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;b</title>
<path fill="none" stroke="black" d="M27,-71.7C27,-63.98 27,-54.71 27,-46.11"></path>
<polygon fill="black" stroke="black" points="30.5,-46.1 27,-36.1 23.5,-46.1 30.5,-46.1"></polygon>
</g>
</g>
</svg>`;

        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render();

        assert.equal(d3_select('div').html(), svgDoc, "SVG after initial rendering");

        // Check data tag by tag
        assert.equal(d3_select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
        assert.equal(d3_select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
        assert.equal(d3_select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
        assert.equal(d3_select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
        assert.equal(d3_select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
        assert.equal(d3_select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
        assert.equal(d3_select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

        // Check data tag by id
        assert.equal(d3_select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
        assert.equal(d3_select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
        assert.equal(d3_select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
        assert.equal(d3_select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

        // Check data tag by class
        assert.equal(d3_select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
        assert.equal(d3_select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
        assert.equal(d3_select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

        // Check full data structure for some primary elements
        var data = d3_select('svg').data();
        var svgData = data[0];
        var graph0Data = svgData.children[1];

        assert.deepEqual(d3_select('svg').datum(), svgData, 'Data structure present on SVG');
        assert.deepEqual(d3_select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
        assert.deepEqual(d3_select('#node1').datum(), graph0Data.children[5], 'Data structure present on element with id "node1"');
        assert.deepEqual(d3_select('#node2').datum(), graph0Data.children[9], 'Data structure present on element with id "node2"');
        assert.deepEqual(d3_select('#edge1').datum(), graph0Data.children[13], 'Data structure present on element with id "edge1"');

        resolve();
    }
}));

it("graphviz().render() renders on a div with sub-elements", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render();

        // Check data tag by tag
        assert.equal(d3_select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
        assert.equal(d3_select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
        assert.equal(d3_select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
        assert.equal(d3_select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
        assert.equal(d3_select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
        assert.equal(d3_select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
        assert.equal(d3_select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

        // Check data tag by id
        assert.equal(d3_select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
        assert.equal(d3_select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
        assert.equal(d3_select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
        assert.equal(d3_select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

        // Check data tag by class
        assert.equal(d3_select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
        assert.equal(d3_select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
        assert.equal(d3_select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

        // Check full data structure for some primary elements
        var data = d3_select('svg').data();
        var svgData = data[0];
        var graph0Data = svgData.children[1];

        assert.deepEqual(d3_select('svg').datum(), svgData, 'Data structure present on SVG');
        assert.deepEqual(d3_select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
        assert.deepEqual(d3_select('#node1').datum(), graph0Data.children[5], 'Data structure present on element with id "node1"');
        assert.deepEqual(d3_select('#node2').datum(), graph0Data.children[9], 'Data structure present on element with id "node2"');
        assert.deepEqual(d3_select('#edge1').datum(), graph0Data.children[13], 'Data structure present on element with id "edge1"');

        resolve();
    }
}));

it("graphviz().render() removes SVG elements for nodes and edges when removed from updated DOT.", html, () => new Promise(resolve => {

    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        graphviz
            .dot('digraph {a}')
            .render();

        const svgDoc2 = `<svg width="62pt" height="44pt" viewBox="0.00 0.00 62.00 44.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 40)">
<polygon fill="white" stroke="none" points="-4,4 -4,-40 58,-40 58,4 -4,4"></polygon>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="black" cx="27" cy="-18" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00">a</text>
</g>
</g>
</svg>`;

        assert.equal(d3_selectAll('.node').size(), 1, 'Number of nodes after removal');
        assert.equal(d3_selectAll('.edge').size(), 0, 'Number of edges after removal');
        assert.equal(d3_select('div').html(), svgDoc2, "SVG after removal of one edge and one node");

        resolve();
    };
}));

it("graphviz().render() adds SVG elements for nodes and edges when added to updated DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        graphviz
            .dot('digraph {a -> b; a -> c}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes after add');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after add');

        resolve();
    }
}));

it("graphviz().renderDot() renders an SVG from graphviz DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {a -> b;}');
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of initial ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of initial polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');

        resolve();
    }
}));

it("graphviz().render() updates SVG text element when node name changes in DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 1, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 0, 'Number of initial edges');
        assert.equal(d3_selectAll('text').text(), 'a', 'Text of initial node');
        graphviz
            .dot('digraph {b}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 1, 'Number of nodes after node name change');
        assert.equal(d3_selectAll('.edge').size(), 0, 'Number of edges after node name change');
        assert.equal(d3_selectAll('text').text(), 'b', 'Text after node name change');

        resolve();
    }
}));

it("graphviz().render() changes SVG element type when node shape changes in DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of initial ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of initial polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');
        graphviz
            .dot('digraph {a [shape="box"];a -> b}')
            .render();
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes after shape change');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of edges after shape change');
        assert.equal(d3_selectAll('ellipse').size(), 1, 'Number of ellipses after shape change');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons after shape change');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths after shape change');

        resolve();
    }
}));

it("graphviz().renderDot() renders an SVG from graphviz strict undirectd DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('strict graph {a -- b;}');
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of initial ellipses');
        assert.equal(d3_selectAll('polygon').size(), 1, 'Number of initial polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');
        graphviz
            .dot('graph {a -- b; b -- a}')
            .fade(false)
            .tweenPaths(false)
            .render();
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes after adding one edge');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after adding one edge');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses after adding one edge');
        assert.equal(d3_selectAll('polygon').size(), 1, 'Number of polygons after adding one edge');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths after adding one edge');

        resolve();
    }
}));

it("graphviz().renderDot() renders an SVG from graphviz strict directd DOT.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {a -> b;}');
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of initial ellipses');
        assert.equal(d3_selectAll('polygon').size(), 2, 'Number of initial polygons');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of initial paths');
        graphviz
            .dot('strict digraph {a -> b; b -> a}')
            .fade(false)
            .tweenPaths(false)
            .render();
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of nodes after adding an edge');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after adding an edge');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses after adding an edge');
        assert.equal(d3_selectAll('polygon').size(), 3, 'Number of polygons after adding an edge');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths after adding an edge');

        resolve();
    }
}));

it("graphviz().render() renders edges with tooltip attribute.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b;}');
        assert.equal(d3_selectAll('.node').size(), 2, 'Number of initial nodes');
        assert.equal(d3_selectAll('.edge').size(), 1, 'Number of initial edges');
        assert.equal(d3_selectAll('g').size(), 5, 'Number of groups');
        assert.equal(d3_selectAll('a').size(), 1, 'Number of hyperlinks');
        assert.equal(d3_selectAll('ellipse').size(), 2, 'Number of ellipses');
        assert.equal(d3_selectAll('path').size(), 1, 'Number of paths');
        graphviz
            .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b; a -> c}')
        assert.equal(d3_selectAll('.node').size(), 3, 'Number of nodes after add');
        assert.equal(d3_selectAll('.edge').size(), 2, 'Number of edges after add');
        assert.equal(d3_selectAll('g').size(), 8, 'Number of groups');
        assert.equal(d3_selectAll('a').size(), 2, 'Number of hyperlinks');
        assert.equal(d3_selectAll('ellipse').size(), 3, 'Number of ellipses');
        assert.equal(d3_selectAll('path').size(), 2, 'Number of paths');

        resolve();
    }
}));
