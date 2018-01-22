var tape = require("tape");
var jsdom = require("./jsdom");
var d3_graphviz = require("../");

tape("The attributer is called during rendering.", function(test) {
    var window = global.window = jsdom('<div id="graph"></div>');
    var document = global.document = window.document;
    var graphviz = d3_graphviz.graphviz("#graph");

    var tagCounts = [];
    graphviz
        .zoom(false)
        .attributer(function(d) {
            if (!(d.tag in tagCounts)) {
                tagCounts[d.tag] = 0
            }
            tagCounts[d.tag] += 1
        })
        .dot('digraph {a -> b;}')
        .render(part2.bind(null, tagCounts));

    function part2(tagCounts) {
        test.equal(tagCounts['svg'], 1, "The attributer is called 1 time for 'svg' elements when enabled")
        test.equal(tagCounts['g'], 4, "The attributer is called 4 times for 'g' elements when enabled")
        test.equal(tagCounts['polygon'], 2, "The attributer is called 2 times for 'polygon' elements when enabled")
        test.equal(tagCounts['ellipse'], 2, "The attributer is called 2 times for 'ellipse' elements when enabled")
        test.equal(tagCounts['path'], 1, "The attributer is called 1 time for 'path' elements when enabled")
        test.equal(tagCounts['title'], 4, "The attributer is called 4 times for 'title' elements when enabled")
        test.equal(tagCounts['text'], 2, "The attributer is called 2 times for 'text' elements when enabled")
        test.equal(tagCounts['#text'], 29, "The attributer is called 29 times for '#text' elements when enabled")
        test.equal(tagCounts['#comment'], 3, "The attributer is called 3 times for '#text' elements when enabled")

        for (tag in tagCounts) {
            tagCounts[tag] = 0
        }

        graphviz
            .zoom(false)
            .attributer(null)
            .dot('digraph {a -> b;}')
            .render(part3.bind(null, tagCounts));
    }

    function part3(tagCounts) {
        test.equal(tagCounts['svg'], 0, "The attributer is called 0 times for 'svg' elements when disabled")
        test.equal(tagCounts['g'], 0, "The attributer is called 0 times for 'g' elements when disabled")
        test.equal(tagCounts['polygon'], 0, "The attributer is called 0 times for 'polygon' elements when disabled")
        test.equal(tagCounts['ellipse'], 0, "The attributer is called 0 times for 'ellipse' elements when disabled")
        test.equal(tagCounts['path'], 0, "The attributer is called 0 times for 'path' elements when disabled")
        test.equal(tagCounts['title'], 0, "The attributer is called 0 times for 'title' elements when disabled")
        test.equal(tagCounts['text'], 0, "The attributer is called 0 times for 'text' elements when disabled")
        test.equal(tagCounts['#text'], 0, "The attributer is called 0 times for '#text' elements when disabled")
        test.equal(tagCounts['#comment'], 0, "The attributer is called 0 times for '#text' elements when disabled")
        test.end();
    }
});
