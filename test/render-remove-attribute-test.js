var tape = require("tape");
var jsdom = require("./jsdom");
var d3 = require("d3-selection");
var d3_transition = require("d3-transition");
var d3_graphviz = require("../");

tape("graphviz().render() removes attribute from SVG element when attribute is removed from Graphviz node.", function(test) {

    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;

    var graphviz = d3_graphviz.graphviz("#graph");

    graphviz
        .zoom(false)
        .renderDot('digraph {a [style=dashed]}', function() {
            test.equal(d3.selectAll('ellipse').attr('stroke-dasharray'), '5,2', 'stroke-dasharray is present when style="dashed"');
            graphviz
                .renderDot('digraph {a}', function () {
                    test.equal(d3.selectAll('ellipse').attr('stroke-dasharray'), null, 'stroke-dasharray not present when style is not used');
                    test.end();
                });
        });
});
