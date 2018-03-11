var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_graphviz = require("../");

tape("graphviz().render() renders an SVG from graphviz DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    svgDoc = `<svg width="62pt" height="116pt" viewBox="0.00 0.00 62.00 116.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 112)">
<title>%0</title>
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-112 58,-112 58,4 -4,4"></polygon>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-90" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-85.8" font-family="Times,serif" font-size="14.00" fill="#000000">a</text>
</g>
<!-- b -->
<g id="node2" class="node">
<title>b</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-18" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00" fill="#000000">b</text>
</g>
<!-- a&#45;&gt;b -->
<g id="edge1" class="edge">
<title>a-&gt;b</title>
<path fill="none" stroke="#000000" d="M27,-71.8314C27,-64.131 27,-54.9743 27,-46.4166"></path>
<polygon fill="#000000" stroke="#000000" points="30.5001,-46.4132 27,-36.4133 23.5001,-46.4133 30.5001,-46.4132"></polygon>
</g>
</g>
</svg>`;

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();

    test.equal(d3.select('div').html(), svgDoc, "SVG after initial rendering");

    // Check data tag by tag
    test.equal(d3.select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
    test.equal(d3.select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
    test.equal(d3.select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
    test.equal(d3.select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
    test.equal(d3.select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
    test.equal(d3.select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
    test.equal(d3.select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

    // Check data tag by id
    test.equal(d3.select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
    test.equal(d3.select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
    test.equal(d3.select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
    test.equal(d3.select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

    // Check data tag by class
    test.equal(d3.select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
    test.equal(d3.select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
    test.equal(d3.select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    test.deepEqual(d3.select('svg').datum(), svgData, 'Data structure present on SVG');
    test.deepEqual(d3.select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
    test.deepEqual(d3.select('#node1').datum(), graph0Data.children[7], 'Data structure present on element with id "node1"');
    test.deepEqual(d3.select('#node2').datum(), graph0Data.children[11], 'Data structure present on element with id "node2"');
    test.deepEqual(d3.select('#edge1').datum(), graph0Data.children[15], 'Data structure present on element with id "edge1"');

    test.end();
});

tape("graphviz().render() renders on a div with sub-elements", function(test) {
    var window = global.window = jsdom('<div id="graph"><div id="dummy">Hello World</div></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();

    // Check data tag by tag
    test.equal(d3.select('svg').data()[0].tag, 'svg', '"svg" tag present in data joined with SVG');
    test.equal(d3.select('g').data()[0].tag, 'g', '"g" tag present in data joined with first svg group element');
    test.equal(d3.select('title').data()[0].tag, 'title', '"title" tag present in data joined with first title element');
    test.equal(d3.select('ellipse').data()[0].tag, 'ellipse', '"ellipse" tag present in data joined with first ellipse element');
    test.equal(d3.select('text').data()[0].tag, 'text', '"text" tag present in data joined with first text element');
    test.equal(d3.select('path').data()[0].tag, 'path', '"path" tag present in data joined with first path element');
    test.equal(d3.select('polygon').data()[0].tag, 'polygon', '"polygon" tag present in data joined with first polygon element');

    // Check data tag by id
    test.equal(d3.select('#graph0').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "graph0"');
    test.equal(d3.select('#node1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node1"');
    test.equal(d3.select('#node2').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "node2"');
    test.equal(d3.select('#edge1').data()[0].tag, 'g', '"g" tag present in data joined with first element with id "edge1"');

    // Check data tag by class
    test.equal(d3.select('.graph').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "graph"');
    test.equal(d3.select('.node').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "node"');
    test.equal(d3.select('.edge').data()[0].tag, 'g', '"g" tag present in data joined with first element with class "edge"');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    test.deepEqual(d3.select('svg').datum(), svgData, 'Data structure present on SVG');
    test.deepEqual(d3.select('#graph0').datum(), graph0Data, 'Data structure present on element with id "graph0"');
    test.deepEqual(d3.select('#node1').datum(), graph0Data.children[7], 'Data structure present on element with id "node1"');
    test.deepEqual(d3.select('#node2').datum(), graph0Data.children[11], 'Data structure present on element with id "node2"');
    test.deepEqual(d3.select('#edge1').datum(), graph0Data.children[15], 'Data structure present on element with id "edge1"');

    test.end();
});

tape("graphviz().render() removes SVG elements for nodes and edges when removed from updated DOT.", function(test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    graphviz
        .dot('digraph {a}')
        .render();

    svgDoc2 = `<svg width="62pt" height="44pt" viewBox="0.00 0.00 62.00 44.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 40)">
<title>%0</title>
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-40 58,-40 58,4 -4,4"></polygon>
<!-- a -->
<g id="node1" class="node">
<title>a</title>
<ellipse fill="none" stroke="#000000" cx="27" cy="-18" rx="27" ry="18"></ellipse>
<text text-anchor="middle" x="27" y="-13.8" font-family="Times,serif" font-size="14.00" fill="#000000">a</text>
</g>
</g>
</svg>`;

    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after removal');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after removal');
    test.equal(d3.select('div').html(), svgDoc2, "SVG after removal of one edge and one node");

    test.end();
});

tape("graphviz().render() adds SVG elements for nodes and edges when added to updated DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    graphviz
        .dot('digraph {a -> b; a -> c}')
        .render();
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');

    test.end();
});

tape("graphviz().renderDot() renders an SVG from graphviz DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');

    test.end();
});

tape("graphviz().render() updates SVG text element when node name changes in DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a}')
        .render();
    test.equal(d3.selectAll('.node').size(), 1, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of initial edges');
    test.equal(d3.selectAll('text').text(), 'a', 'Text of initial node');
    graphviz
        .dot('digraph {b}')
        .render();
    test.equal(d3.selectAll('.node').size(), 1, 'Number of nodes after node name change');
    test.equal(d3.selectAll('.edge').size(), 0, 'Number of edges after node name change');
    test.equal(d3.selectAll('text').text(), 'b', 'Text after node name change');

    test.end();
});

tape("graphviz().render() changes SVG element type when node shape changes in DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .dot('digraph {a -> b;}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    graphviz
        .dot('digraph {a [shape="box"];a -> b}')
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after shape change');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges after shape change');
    test.equal(d3.selectAll('ellipse').size(), 1, 'Number of ellipses after shape change');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after shape change');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths after shape change');

    test.end();
});

tape("graphviz().renderDot() renders an SVG from graphviz strict undirectd DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('strict graph {a -- b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    graphviz
        .dot('graph {a -- b; b -- a}')
        .fade(false)
        .tweenPaths(false)
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after adding one edge');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after adding one edge');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after adding one edge');
    test.equal(d3.selectAll('polygon').size(), 1, 'Number of polygons after adding one edge');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after adding one edge');

    test.end();
});

tape("graphviz().renderDot() renders an SVG from graphviz strict directd DOT.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of initial ellipses');
    test.equal(d3.selectAll('polygon').size(), 2, 'Number of initial polygons');
    test.equal(d3.selectAll('path').size(), 1, 'Number of initial paths');
    graphviz
        .dot('strict digraph {a -> b; b -> a}')
        .fade(false)
        .tweenPaths(false)
        .render();
    test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after adding an edge');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after adding an edge');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses after adding an edge');
    test.equal(d3.selectAll('polygon').size(), 3, 'Number of polygons after adding an edge');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths after adding an edge');

    test.end();
});

tape("graphviz().render() renders edges with tooltip attribute.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b;}');
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    test.equal(d3.selectAll('g').size(), 5, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 1, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 2, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 1, 'Number of paths');
    graphviz
        .renderDot('digraph {edge [tooltip="\\\\E"]; a -> b; a -> c}')
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');
    test.equal(d3.selectAll('g').size(), 8, 'Number of groups');
    test.equal(d3.selectAll('a').size(), 2, 'Number of hyperlinks');
    test.equal(d3.selectAll('ellipse').size(), 3, 'Number of ellipses');
    test.equal(d3.selectAll('path').size(), 2, 'Number of paths');

    test.end();
});
