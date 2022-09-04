import assert from "assert";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";

const html = '<div id="graph"></div>';

it("graphviz() returns an exiting renderer.", html, () => new Promise(resolve => {
    var graphviz1 = d3_graphviz("#graph")
        .on("initEnd", startTest);
    var graphviz2;
    var graphviz3;

    function startTest() {
        assert.equal(graphviz1.options().tweenShapes, true, "Options have default values when renderer is created");

        graphviz1
            .tweenShapes(false)
            .dot('digraph {a -> b;}')
            .render();

        assert.equal(graphviz1.options().tweenShapes, false, "Options are changed when set on the created renderer");

        // Attempt to create a new renderer on the same element

        graphviz2 = d3_graphviz("#graph")
            .on("initEnd", startTest2);
    }

    function startTest2() {
        assert.equal(graphviz1, graphviz2, "The returned renderer is the same as the one originally created");
        assert.equal(graphviz2.options().tweenShapes, false, "Options set on the originally created renderer is preserved");

        graphviz2
            .dot('digraph {a -> b; a -> c}')
            .render();

        // Attempt to create another new renderer on the same element with different options

        graphviz3 = d3_graphviz("#graph", {tweenShapes: true})
            .on("initEnd", startTest3);
    }

    function startTest3() {
        assert.equal(graphviz1, graphviz3, "The returned renderer is the same as the one originally created");
        assert.equal(graphviz3.options().tweenShapes, true, "Options are changed if specified when creating the new renderer");

        graphviz3
            .dot('digraph {a -> b; a -> c; a -> d}')
            .render();

        resolve();
    }
}));
