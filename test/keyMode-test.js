import assert from "assert";
import it from "./it.js";
import jsdom from "./jsdom.js";
import * as d3 from "d3-selection";
import * as d3_transition from "d3-transition";
import * as d3_graphviz from "../index.js";

it("graphviz().keyMode() affects transitions and order of rendering.", async function () {
    var window = global.window = jsdom('<div id="main"></div>');
    global.document = window.document;
    var keyModes = [
        'title',
        'tag-index',
        'id',
        'index',
    ];
    const nRenderings = 2;
    var delay = 500;
    var duration = 500;
    this.timeout(2000 + keyModes.length * nRenderings * (delay + duration)); // FIXME
    await new Promise(resolve0 => {
        var keyModeIndex = 0;
        renderKeyMode();
        async function renderKeyMode() {
            const keyMode = keyModes[keyModeIndex];
            d3.select('#main')
                .append('div')
                .attr('id', 'graph-' + keyMode);

            var graphviz;

            await new Promise(resolve => {
                graphviz = d3_graphviz.graphviz("#graph-" + keyMode)
                    .on("initEnd", resolve);
            });

            await new Promise(resolve => {
                graphviz
                    .tweenShapes(false)
                    .zoom(false)
                    .keyMode(keyMode)
                    .dot('digraph {a -> b; c}')
                    .transition(function () {
                        return d3_transition.transition().delay(delay).duration(duration);
                    })
                    .render()
                    .on("end", resolve);
            });

            checkInitalRendering(keyMode);

            await new Promise(resolve => {
                graphviz
                    .keyMode(keyMode)
                    .dot('digraph {a -> b; b -> a}')
                    .transition(function () {
                        d3_transition.transition("helper-" + keyMode).delay(delay).duration(0)
                            .transition().delay(0).duration(0)
                            .on("start", function () {
                                checkAtStarting(keyMode);
                            })
                            .transition().delay(0).duration(0)
                            .on("start", function () {
                                checkAfterStarting(keyMode);
                            });
                        return d3_transition.transition("main-" + keyMode).delay(delay).duration(duration);
                    })
                    .fade(false)
                    .tweenPaths(false)
                    .render()
                    .on("renderEnd", function () {
                        checkBeforeScheduling(keyMode);
                    })
                    .on("transitionStart", function () {
                        checkBeforeScheduling(keyMode);
                    })
                    .on("transitionEnd", function () {
                        checkAtEnding(keyMode);
                    })
                    .on("restoreEnd", function () {
                        checkAfterEnding(keyMode)
                    })
                    .on("end", resolve);
            });

            checkAfterEnding(keyMode)

            if (keyMode == keyModes[keyModes.length - 1]) {
                resolve0();
            } else {
                keyModeIndex += 1;
                renderKeyMode()
            }
        }
    });

    function check(counts, state, keyMode) {
        for (let name in counts) {
            var count = counts[name];
            const objectName = name.replace('.', '');
            assert.equal(d3.select('#graph-' + keyMode).selectAll(name).size(), count, 'Number of ' + objectName + 's is ' + count + ' ' + state + ' transition with keyMode ' + keyMode);
        }
    }

    function checkInitalRendering(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': 2,
            'ellipse': 3,
        };
        check(counts, 'after initial rendering without', keyMode);
    }

    function checkBeforeScheduling(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'before scheduling', keyMode);
    }

    function checkBeforeStarting(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'before starting', keyMode);
    }

    function checkAtStarting(keyMode) {
        var counts = {
            '.node': 3,
            '.edge': 1,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'at starting', keyMode);
    }

    function checkAfterStarting(keyMode) {
        var counts = {
            '.node': keyMode == 'tag-index' ? 2 : keyMode == 'index' ? 5 : 3,
            '.edge': keyMode == 'index' ? 3 : 2,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'after starting', keyMode);
    }

    function checkAtEnding(keyMode) {
        var counts = {
            '.node': keyMode == 'tag-index' ? 2 : keyMode == 'index' ? 5 : 3,
            '.edge': keyMode == 'index' ? 3 : 2,
            'polygon': keyMode == 'index' ? 5 : 3,
            'ellipse': keyMode == 'index' ? 5 : 3,
        };
        check(counts, 'at ending', keyMode);
    }

    function checkAfterEnding(keyMode) {
        var counts = {
            '.node': 2,
            '.edge': 2,
            'polygon': 3,
            'ellipse': 2,
        };
        check(counts, 'after ending', keyMode);
    }

});

it("graphviz().keyMode() does not accept illegal key modes.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    function useIllegalKeyMode() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode('illegal-key-mode')
            .dot('digraph {a -> b}')
            .render();
    }

    assert.throws(useIllegalKeyMode, 'Illegal keyMode throws error');


});

it("graphviz().keyMode() cannot be changed after applying dot source.", async () => {
    var window = global.window = jsdom('<div id="graph"></div>');
    global.document = window.document;
    var graphviz;

    await new Promise(resolve => {
        graphviz = d3_graphviz.graphviz("#graph")
            .on("initEnd", resolve);
    });

    function changeKeyMode() {
        graphviz
            .tweenShapes(false)
            .zoom(false)
            .keyMode('title')
            .dot('digraph {a -> b}')
            .keyMode('id')
            .render();
    }

    assert.throws(changeKeyMode, 'Too late change of keyMode throws error');

});
