import assert from "assert";
import {select as d3_select} from "d3-selection";
import {graphviz as d3_graphviz} from "../index.js";
import it from "./jsdom.js";
import deepEqualData from "./deepEqualData.js";
import {translatePointsAttribute} from "../src/svg.js"
import SharedWorker from "./polyfill_SharedWorker.js";

const html = `
    <script src="http://dummyhost/test/@hpcc-js/wasm/dist/wrapper.js" type="javascript/worker"></script>
    <div id="expected-graph"></div><div id="actual-graph"></div>
    `;

it("Verify that polygon shape is drawn exactly as Graphviz does.", html, () => new Promise(resolve => {
    var Blob = global.Blob = function (jsarray) {
        return new Function(jsarray[0]);
    }
    var createObjectURL = window.URL.createObjectURL = function (js) {
        return js;
    }
    global.SharedWorker = SharedWorker;
    var expectedGraph = d3_select("#expected-graph");
    var actualGraph = d3_select("#actual-graph");
    var actualGraphviz;
    var expectedGraphviz = d3_graphviz("#expected-graph", {useSharedWorker: true})
        .on('initEnd', () => {
            actualGraphviz = d3_graphviz("#actual-graph")
                .on('initEnd', startTest);
        });

    function startTest() {
    expectedGraphviz
        .zoom(false)
        .renderDot('digraph {a [shape="polygon"]}', function () {
            actualGraphviz
                .renderDot('digraph {}', function () {
                    var x = 27;
                    var y = -18;
                    actualGraphviz
                        .drawNode(x, y, 'a', {shape: 'polygon', id: 'node1'})
                        .insertDrawnNode('a');

                    const expectedNodeGroup = expectedGraph.selectAll('.node');
                    const expectedNodeTitle = expectedNodeGroup.selectAll('title');
                    const expectedNodeShape = expectedNodeGroup.selectAll('polygon');
                    const expectedNodeText = expectedNodeGroup.selectAll('text');

                    const actualNodeGroup = actualGraph.selectAll('.node');
                    const actualNodeTitle = actualNodeGroup.selectAll('title');
                    const actualNodeShape = actualNodeGroup.selectAll('polygon');
                    const actualNodeText = actualNodeGroup.selectAll('text');

                    var bbox = expectedNodeShape.node().getBBox();
                    bbox.cx = bbox.x + bbox.width / 2;
                    bbox.cy = bbox.y + bbox.height / 2;
                    var xoffs = x - bbox.cx;
                    var yoffs = y - bbox.cy;

                    assert.equal(actualNodeGroup.attr("id"), expectedNodeGroup.attr("id"), 'id of group');

                    assert.equal(actualNodeTitle.text(), expectedNodeTitle.text(), 'text of title');

                    assert.equal(actualNodeShape.attr("fill"), expectedNodeShape.attr("fill"), 'fill of polygon');
                    assert.equal(actualNodeShape.attr("stroke"), expectedNodeShape.attr("stroke"), 'stroke of polygon');
                    assert.equal(actualNodeShape.attr("points"), translatePointsAttribute(expectedNodeShape.attr("points"), xoffs, yoffs), 'points of polygon');

                    assert.equal(actualNodeText.attr("text-anchor"), expectedNodeText.attr("text-anchor"), 'text-anchor of text');
                    assert.equal(+actualNodeText.attr("x"), +expectedNodeText.attr("x") + xoffs, 'x of text');
                    assert.equal(+actualNodeText.attr("y"), +expectedNodeText.attr("y") + yoffs, 'y of text');
                    assert.equal(actualNodeText.attr("font-family"), expectedNodeText.attr("font-family"), 'font-family of text');
                    assert.equal(actualNodeText.attr("font-size"), expectedNodeText.attr("font-size"), 'font-size of text');
                    assert.equal(actualNodeText.attr("fill"), expectedNodeText.attr("fill"), 'fill of text');

                    assert.equal(actualNodeText.text(), expectedNodeText.text(), 'text of node group');

                    var actualNodeGroupDatum = actualNodeGroup.datum();
                    var expectedNodeGroupDatum = expectedNodeGroup.datum();
                    delete expectedNodeGroupDatum.parent;
                    deepEqualData(actualNodeGroupDatum, expectedNodeGroupDatum, 'data of drawn node of shape equals Graphviz generated data');

                    expectedGraphviz.destroy();
                    actualGraphviz.destroy();
                    global.SharedWorker = undefined;
                    resolve();
                });
        });
    }
}));
