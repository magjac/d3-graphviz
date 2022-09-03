import assert from "assert";
import deepEqual from 'deep-equal';

export default function (actualData, expectedData, message) {

    function parseData(parent) {

        for (let i in parent.children) {
            const child = parent.children[i]
            if (typeof child.parent != 'string') {
                assert.equal(parent, child.parent,
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

    assert.deepEqual(expectedData, actualData, message);

}
