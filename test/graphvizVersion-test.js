var tape = require("tape");
var d3_graphviz = require("../");

tape("graphviz().graphvizVersion() return the Graphviz version.", function(test) {

    var graphviz = d3_graphviz.graphviz("#graph")
        .on("initEnd", startTest);

    function startTest() {
        const version = graphviz.graphvizVersion();
        if (version == undefined) {
            test.fail("version is not defined")
        }
        else {
            const [major, minor, patch] = version.split('.');
            test.ok(!isNaN(major), 'Major version number is a number');
            test.ok(!isNaN(minor), 'Minor version number is a number');
            test.ok(!isNaN(patch), 'Patch version number is a number');
        }

        test.end();
    }
});
