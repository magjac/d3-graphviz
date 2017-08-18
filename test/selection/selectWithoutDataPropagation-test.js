var tape = require("tape"),
    jsdom = require("../jsdom"),
    d3_selection = require("d3-selection"),
    d3_graphviz = require("../../");

tape("selection.selectWithoutDataPropagation() selects without propagating data", function(test) {
    var document = global.document = jsdom('<div id="parent"><div id="child1"></div><div id="child2"></div></div>');

    var parent = d3_selection.select("#parent");
    parent
        .data([1])
    var child1 = parent
        .select("#child1")
    var child2 = parent
        .selectWithoutDataPropagation("#child2")

    test.equal(child1.data()[0], 1, 'selection.select() propagates data to child');
    test.equal(child2.data()[0], undefined, 'selection.selectWithoutDataPropagation() does no propagat data to child');

    test.end();
});
