import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("graphviz().render() renders an SVG from graphviz DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");
    await new Promise(resolve => {
        graphviz.on("initEnd", resolve);
    });

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
<path fill="none" stroke="black" d="M27,-71.7C27,-64.41 27,-55.73 27,-47.54"></path>
<polygon fill="black" stroke="black" points="30.5,-47.62 27,-37.62 23.5,-47.62 30.5,-47.62"></polygon>
</g>
</g>
</svg>`;

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.select('div').html(), svgDoc, "SVG after initial rendering");

    // Check data tag by tag
    assert.equal(d3.select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
    assert.equal(d3.select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
    assert.equal(d3.select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
    assert.equal(d3.select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
    assert.equal(d3.select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
    assert.equal(d3.select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
    assert.equal(d3.select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

    // Check data tag by id
    assert.equal(d3.select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
    assert.equal(d3.select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
    assert.equal(d3.select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
    assert.equal(d3.select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

    // Check data tag by class
    assert.equal(d3.select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
    assert.equal(d3.select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
    assert.equal(d3.select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    assert.deepStrictEqual(d3.select('svg').datum(), svgData, 'Data structure present on SVG');
    assert.deepStrictEqual(d3.select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
    assert.deepStrictEqual(d3.select('#node1').datum(), graph0Data.children[5], 'Data structure present on element with id "node1"');
    assert.deepStrictEqual(d3.select('#node2').datum(), graph0Data.children[9], 'Data structure present on element with id "node2"');
    assert.deepStrictEqual(d3.select('#edge1').datum(), graph0Data.children[13], 'Data structure present on element with id "edge1"');

});

it("graphviz().render() renders on a div with sub-elements", async () => {
    var window = global.window = jsdom('<div id="graph"><div id="dummy">Hello World</div></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    // Check data tag by tag
    assert.equal(d3.select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
    assert.equal(d3.select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
    assert.equal(d3.select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
    assert.equal(d3.select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
    assert.equal(d3.select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
    assert.equal(d3.select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
    assert.equal(d3.select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

    // Check data tag by id
    assert.equal(d3.select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
    assert.equal(d3.select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
    assert.equal(d3.select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
    assert.equal(d3.select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

    // Check data tag by class
    assert.equal(d3.select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
    assert.equal(d3.select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
    assert.equal(d3.select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    assert.deepStrictEqual(d3.select('svg').datum(), svgData, 'Data structure present on SVG');
    assert.deepStrictEqual(d3.select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
    assert.deepStrictEqual(d3.select('#node1').datum(), graph0Data.children[5], 'Data structure present on element with id "node1"');
    assert.deepStrictEqual(d3.select('#node2').datum(), graph0Data.children[9], 'Data structure present on element with id "node2"');
    assert.deepStrictEqual(d3.select('#edge1').datum(), graph0Data.children[13], 'Data structure present on element with id "edge1"');

});

it("graphviz().render() removes SVG elements for nodes and edges when removed from updated DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a}')
            .render(resolve);
    });

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

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after removal');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after removal');
    assert.equal(d3.select('div').html(), svgDoc2, "SVG after removal of one edge and one node");

});

it("graphviz().render() adds SVG elements for nodes and edges when added to updated DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a -> b; a -> c}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');

});

it("graphviz().renderDot() renders an SVG from graphviz DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {a -> b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

});

it("graphviz().render() updates SVG text element when node name changes in DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
    assert.equal(d3.selectAll('text').text(), 'a', 'Text of initial node');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {b}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after node name change');
    assert.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after node name change');
    assert.equal(d3.selectAll('text').text(), 'b', 'Text after node name change');

});

it("graphviz().render() changes SVG element type when node shape changes in DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

    await new Promise(resolve => {
        graphviz
            .dot('digraph {a [shape="box"];a -> b}')
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after shape change');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after shape change');
    assert.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change');
    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after shape change');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths after shape change');

});

it("graphviz().renderDot() renders an SVG from graphviz strict undirectd DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('strict graph {a -- b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    assert.equal(d3.selectAll('polygon').size(), 1, 'Number of initial polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

    await new Promise(resolve => {
        graphviz
            .dot('graph {a -- b; b -- a}')
            .fade(false)
            .tweenPaths(false)
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after adding one edge');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after adding one edge');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after adding one edge');
    assert.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after adding one edge');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths after adding one edge');

});

it("graphviz().renderDot() renders an SVG from graphviz strict directd DOT.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {a -> b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    assert.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

    await new Promise(resolve => {
        graphviz
            .dot('strict digraph {a -> b; b -> a}')
            .fade(false)
            .tweenPaths(false)
            .render(resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after adding an edge');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after adding an edge');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after adding an edge');
    assert.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after adding an edge');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths after adding an edge');

});

it("graphviz().render() renders edges with tooltip attribute.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    await new Promise(resolve => {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b;}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    assert.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    assert.equal(d3.selectAll('g').size(), 5, 'Number of groups');
    assert.equal(d3.selectAll('a').size(), 1, 'Number of hyperlinks');
    assert.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    assert.equal(d3.selectAll('path').size(), 1, 'Number of paths');

    await new Promise(resolve => {
        graphviz
            .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b; a -> c}', resolve);
    });

    assert.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    assert.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');
    assert.equal(d3.selectAll('g').size(), 8, 'Number of groups');
    assert.equal(d3.selectAll('a').size(), 2, 'Number of hyperlinks');
    assert.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses');
    assert.equal(d3.selectAll('path').size(), 2, 'Number of paths');

});
