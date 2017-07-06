var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_transition = require("d3-transition"),
    d3_timer = require("d3-timer"),
    graphviz = require("../");

tape("graphviz() renders an SVG from graphviz DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');

    svgDoc = `<svg width="62pt" height="116pt" viewbox="0.00 0.00 62.00 116.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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

    graphviz.render('digraph {a -> b;}', "#graph");

    test.equal(d3.select('div').html(), svgDoc, "SVG after initial rendering");

    // Check data tag by tag
    test.equal(d3.select('svg').data()[0].tag, 'svg');
    test.equal(d3.select('g').data()[0].tag, 'g');
    test.equal(d3.select('title').data()[0].tag, 'title');
    test.equal(d3.select('ellipse').data()[0].tag, 'ellipse');
    test.equal(d3.select('text').data()[0].tag, 'text');
    test.equal(d3.select('path').data()[0].tag, 'path');
    test.equal(d3.select('polygon').data()[0].tag, 'polygon');

    // Check data tag by id
    test.equal(d3.select('#graph0').data()[0].tag, 'g');
    test.equal(d3.select('#node1').data()[0].tag, 'g');
    test.equal(d3.select('#node2').data()[0].tag, 'g');
    test.equal(d3.select('#edge1').data()[0].tag, 'g');

    // Check data tag by class
    test.equal(d3.select('.graph').data()[0].tag, 'g');
    test.equal(d3.select('.node').data()[0].tag, 'g');
    test.equal(d3.select('.edge').data()[0].tag, 'g');

    // Check full data structure for some primary elements
    var data = d3.select('svg').data();
    var svgData = data[0];
    var graph0Data = svgData.children[1];

    test.deepEqual(d3.select('svg').datum(), svgData);
    test.deepEqual(d3.select('#graph0').datum(), graph0Data);
    test.deepEqual(d3.select('#node1').datum(), graph0Data.children[7]);
    test.deepEqual(d3.select('#node2').datum(), graph0Data.children[11]);
    test.deepEqual(d3.select('#edge1').datum(), graph0Data.children[15]);

    test.end();
});

tape("graphviz() removes SVG elements for nodes and edges when removed from updated DOT.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');

    graphviz.render('digraph {a -> b;}', "#graph");
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    graphviz.render('digraph {a}', "#graph");

    svgDoc2 = `<svg width="62pt" height="44pt" viewbox="0.00 0.00 62.00 44.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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

tape("graphviz() adds SVG elements for nodes and edges when added to updated DOT.", function(test) {
    var document = global.document = jsdom('<div id="graph"></div>');

    graphviz.render('digraph {a -> b;}', "#graph");
    test.equal(d3.selectAll('.node').size(), 2, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    graphviz.render('digraph {a -> b; a -> c}', "#graph");
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes after add');
    test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after add');

    test.end();
});

tape("graphviz() adds and removes SVG elements after transition delay.", function(test) {

    var document = global.document = jsdom('<div id="graph"></div>');

    graphviz.render('digraph {a -> b; c}', "#graph");
    test.equal(d3.selectAll('.node').size(), 3, 'Number of initial nodes');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of initial edges');
    transition1 = d3_transition.transition().duration(0);
    graphviz.render('digraph {a -> b; b -> a}', "#graph", transition1);
    test.equal(d3.selectAll('.node').size(), 3, 'Number of nodes immediately after rendering');
    test.equal(d3.selectAll('.edge').size(), 1, 'Number of edges immediately after rendering');

    d3_timer.timeout(function(elapsed) {
        part3_end();
    }, 100);

    function part3_end() {

        test.equal(d3.selectAll('.node').size(), 2, 'Number of nodes after transition');
        test.equal(d3.selectAll('.edge').size(), 2, 'Number of edges after transition');

        test.end();
    }
});
