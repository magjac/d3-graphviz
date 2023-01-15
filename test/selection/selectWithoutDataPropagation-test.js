import assert from "assert";
import it from "../it.js";
import jsdom from "../jsdom.js";
import * as d3_selection from "d3-selection";
import * as d3_graphviz from "../../index.js";

it("selection.selectWithoutDataPropagation() selects without propagating data", async () => {
    var window = global.window = jsdom('<div id="parent"><div id="child1"></div><div id="child2"></div></div>');
    var document = global.document = window.document;

    var parent = d3_selection.select("#parent");
    parent
        .data([1])
    var child1 = parent
        .select("#child1")
    var child2 = parent
        .selectWithoutDataPropagation("#child2")

    assert.equal(child1.data()[0], 1, 'selection.select() propagates data to child');
    assert.equal(child2.data()[0], undefined, 'selection.selectWithoutDataPropagation() does no propagat data to child');

});

it("selection.selectWithoutDataPropagation() on empty selection", async () => {
    var window = global.window = jsdom('<div id="parent"><div id="child1"></div><div id="child2"></div></div>');
    var document = global.document = window.document;

    assert.equal(d3_selection.select(null).selectWithoutDataPropagation("dummy").size(), 0, 'selection.select() returns empty selection when applied to an empty selection');

});
