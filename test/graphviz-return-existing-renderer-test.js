import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3_graphviz from "../index.js";

it("graphviz() returns an exiting renderer.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz1;

    await new Promise(resolve => {
        graphviz1 = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    var graphviz2;
    var graphviz3;

    assert.equal(graphviz1.options().tweenShapes, true, "Options have default values when renderer is created");

    await new Promise(resolve => {
        graphviz1
            .tweenShapes(false)
            .dot('digraph {a -> b;}')
            .render(resolve);
    });

    assert.equal(graphviz1.options().tweenShapes, false, "Options are changed when set on the created renderer");

    // Attempt to create a new renderer on the same element

    await new Promise(resolve => {
        graphviz2 = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    assert.equal(graphviz1, graphviz2, "The returned renderer is the same as the one originally created");
    assert.equal(graphviz2.options().tweenShapes, false, "Options set on the originally created renderer is preserved");

    await new Promise(resolve => {
        graphviz2
            .dot('digraph {a -> b; a -> c}')
            .render(resolve);
    });

    // Attempt to create another new renderer on the same element with different options

    await new Promise(resolve => {
        graphviz3 = d3_graphviz.graphviz("#graph", {tweenShapes: true})
            .on("initEnd", resolve);
    });

    assert.equal(graphviz1, graphviz3, "The returned renderer is the same as the one originally created");
    assert.equal(graphviz3.options().tweenShapes, true, "Options are changed if specified when creating the new renderer");

    await new Promise(resolve => {
        graphviz3
            .dot('digraph {a -> b; a -> c; a -> d}')
            .render(resolve);
    });

});
