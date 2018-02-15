var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("d3-selection"),
    d3_transition = require("d3-transition"),
    d3_graphviz = require("../");

tape("graphviz.renderDot() generates a correct SVG from graphviz DOT with graph tooltip.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    svgDoc = `<svg width="8pt" height="8pt" viewBox="0.00 0.00 8.00 8.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 4)">
<title>%0</title>
<g id="a_graph0"><a title="G">
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-4 4,-4 4,4 -4,4"></polygon>
</a>
</g>
</g>
</svg>`;

    graphviz
        .tweenShapes(false)
        .zoom(false)
        .renderDot('digraph {graph [tooltip="G"]}');

    test.equal(d3.select('div').html(), svgDoc, "SVG after initial rendering");

    test.end();
});

tape("graphviz.transition().renderDot() generates a correct SVG from graphviz DOT with graph tooltip.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    svgDoc = `<svg width="8pt" height="8pt" viewBox="0.00 0.00 8.00 8.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 4)">
<title>%0</title>
<g id="a_graph0"><a title="G">
<polygon fill="#ffffff" stroke="transparent" points="-4,4 -4,-4 4,-4 4,4 -4,4"></polygon>
</a>
</g>
</g>
</svg>`;

    var transition = d3_transition.transition().duration(0);
    graphviz
        .tweenShapes(false)
        .tweenPaths(false)
        .zoom(false)
//        .fade(false)
        .renderDot('digraph {graph [tooltip="G"]}');

    test.equal(d3.select('div').html(), svgDoc, "SVG after initial rendering");

    graphviz
        .tweenShapes(false)
        .tweenPaths(false)
        .zoom(false)
//        .fade(false)
        .transition(transition)
        .renderDot('digraph {graph [tooltip="G"]}');

    transition
        .transition()
        .on("end", function() {
            test.equal(d3.select('div').html(), svgDoc, "SVG after transition");
            test.end();
        });

});
