import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_graphviz from "../index.js";

it("graphviz().options() gets options.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var defaultOptions = {
        tweenShapes: true,
        totalMemory: undefined,
    };
    var graphviz = d3_graphviz.graphviz("#graph");
    var getOptions = graphviz.options();
    assert.equal(getOptions.tweenShapes, defaultOptions.tweenShapes, 'tweenShapes option set true by default');
    assert.equal(getOptions.totalMemory, defaultOptions.totalMemory, 'totalMemory option is undefined by default');

});

it("graphviz(options) sets options at initialization.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var setOptions = {
        tweenShapes: false,
        totalMemory: 65536,
    };
    var graphviz = d3_graphviz.graphviz("#graph", setOptions);
    var getOptions = graphviz.options();
    assert.equal(getOptions.tweenShapes, setOptions.tweenShapes, 'tweenShapes option set false at initialization');
    assert.equal(getOptions.totalMemory, setOptions.totalMemory, 'totalMemory option set to 65536 at initialization');

});

it("graphviz().options(options) sets options.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var setOptions1 = {
        tweenShapes: false,
        totalMemory: 255,
    };
    var graphviz = d3_graphviz.graphviz("#graph");
    graphviz.options(setOptions1);
    var getOptions1 = graphviz.options();
    assert.equal(getOptions1.tweenShapes, setOptions1.tweenShapes, 'tweenShapes option set false by graphviz.options()');
    assert.equal(getOptions1.totalMemory, setOptions1.totalMemory, 'totalMemory option set to 255 by graphviz.options()');

    var setOptions2 = {totalMemory: 32768};
    graphviz.options(setOptions2);
    assert.equal(getOptions1.totalMemory, setOptions1.totalMemory, 'A previously fetched option does not change when a new values is set');
    var getOptions2 = graphviz.options();
    assert.equal(getOptions2.tweenShapes, setOptions1.tweenShapes, 'tweenShapes option keeps the previous value because it is not specified in the options set');
    assert.equal(getOptions2.totalMemory, setOptions2.totalMemory, 'totalMemory option set to 32768 by graphviz.options()');

});
