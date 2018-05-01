module.exports = function (test, expectedData, actualData, message) {

    function parseData(parent) {

        for (i in parent.children) {
            child = parent.children[i]
            if (typeof child.parent != 'string') {
                test.equal(parent, child.parent,
                           'Parent of "' + child.tag + '" "' + child.id + '" is "' +
                           parent.tag + '" "' + parent.id + '"');
            }
            delete child.parent
            parseData(child)
        }
    }

    parseData(expectedData);
    parseData(actualData);

    test.deepLooseEqual(expectedData, actualData, message);

}
