import assert from "assert";
import {select as d3_select} from "d3-selection";
import {graphviz as d3_graphviz} from "../../index.js";
import it from "../jsdom.js";

const html = '<div id="parent"><div id="child1"></div><div id="child2"></div></div>';

it("selection.selectWithoutDataPropagation() selects without propagating data", html, () => new Promise(resolve => {

    var parent = d3_select("#parent");
    parent
        .data([1])
    var child1 = parent
        .select("#child1")
    var child2 = parent
        .selectWithoutDataPropagation("#child2")

    assert.equal(child1.data()[0], 1, 'selection.select() propagates data to child');
    assert.equal(child2.data()[0], undefined, 'selection.selectWithoutDataPropagation() does no propagat data to child');

    resolve();
}));

it("selection.selectWithoutDataPropagation() on empty selection", html, () => new Promise(resolve => {

    assert.equal(d3_select(null).selectWithoutDataPropagation("dummy").size(), 0, 'selection.select() returns empty selection when applied to an empty selection');

    resolve();
}));
