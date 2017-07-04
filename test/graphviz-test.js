var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("d3-selection"),
    graphviz = require("../");

tape("graphviz() renders an SVG from graphviz DOT.", function(test) {
    var document = global.document = jsdom.jsdom('<div id="graph"></div>');

    svgDoc = `
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
`.replace(/<!--.*-->\n/g, '').replace(/\n/g, '');

    test.equal(graphviz.render('digraph {a -> b;}', "#graph").html(), svgDoc);

    test.equal(d3.select('svg').html(), svgDoc);
    test.end();
});
