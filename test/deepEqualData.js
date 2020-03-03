var deepEqual = require('deep-equal');

module.exports = function (test, actualData, expectedData, message) {

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

    if (!deepEqual(actualData, expectedData)) {
        console.log('actualData:');
        console.log(JSON.stringify(actualData, null, 4));
        console.log('expectedData:');
        console.log(JSON.stringify(expectedData, null, 4));
    }

    test.deepLooseEqual(expectedData, actualData, message);

}
