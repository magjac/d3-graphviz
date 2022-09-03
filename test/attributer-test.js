import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("The attributer is called during rendering.", html, () => new Promise(resolve => {
    var graphviz = d3_graphviz("#graph")
        .on("initEnd", function () {

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
        });

    function part2(tagCounts) {
        assert.equal(tagCounts['svg'], 1, "The attributer is called 1 time for 'svg' elements when enabled")
        assert.equal(tagCounts['g'], 4, "The attributer is called 4 times for 'g' elements when enabled")
        assert.equal(tagCounts['polygon'], 2, "The attributer is called 2 times for 'polygon' elements when enabled")
        assert.equal(tagCounts['ellipse'], 2, "The attributer is called 2 times for 'ellipse' elements when enabled")
        assert.equal(tagCounts['path'], 1, "The attributer is called 1 time for 'path' elements when enabled")
        assert.equal(tagCounts['title'], 3, "The attributer is called 3 times for 'title' elements when enabled")
        assert.equal(tagCounts['text'], 2, "The attributer is called 2 times for 'text' elements when enabled")
        assert.equal(tagCounts['#text'], 27, "The attributer is called 27 times for '#text' elements when enabled")
        assert.equal(tagCounts['#comment'], 3, "The attributer is called 3 times for '#text' elements when enabled")

        for (let tag in tagCounts) {
            tagCounts[tag] = 0
        }

        graphviz
            .zoom(false)
            .attributer(null)
            .dot('digraph {a -> b;}')
            .render(part3.bind(null, tagCounts));
    }

    function part3(tagCounts) {
        assert.equal(tagCounts['svg'], 0, "The attributer is called 0 times for 'svg' elements when disabled")
        assert.equal(tagCounts['g'], 0, "The attributer is called 0 times for 'g' elements when disabled")
        assert.equal(tagCounts['polygon'], 0, "The attributer is called 0 times for 'polygon' elements when disabled")
        assert.equal(tagCounts['ellipse'], 0, "The attributer is called 0 times for 'ellipse' elements when disabled")
        assert.equal(tagCounts['path'], 0, "The attributer is called 0 times for 'path' elements when disabled")
        assert.equal(tagCounts['title'], 0, "The attributer is called 0 times for 'title' elements when disabled")
        assert.equal(tagCounts['text'], 0, "The attributer is called 0 times for 'text' elements when disabled")
        assert.equal(tagCounts['#text'], 0, "The attributer is called 0 times for '#text' elements when disabled")
        assert.equal(tagCounts['#comment'], 0, "The attributer is called 0 times for '#text' elements when disabled")

        resolve();
    }
}));
