import * as d3 from "d3-selection";

export function extractElementData(element) {

    var datum = {};
    var tag = element.node().nodeName;
    datum.tag = tag;
    datum.attributes = {};
    var attributes = element.node().attributes;
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var name = attribute.name;
            var value = attribute.value;
            datum.attributes[name] = value;
        }
    }
    if (tag == '#text') {
        datum.text = element.text();
    } else if (tag == '#comment') {
        datum.comment = element.text();
    }
    return datum
}

export function createElement(data) {

    if (data.tag == '#text') {
        return document.createTextNode(data.text);
    } else if (data.tag == '#comment') {
        return document.createComment(data.comment);
    } else {
        return document.createElementNS('http://www.w3.org/2000/svg', data.tag);
    }
}

export function createElementWithAttributes(data) {

    var elementNode = createElement(data);
    var element = d3.select(elementNode);
    var attributes = data.attributes;
    if (attributes) {
        for (var attributeName of Object.keys(attributes)) {
            var attributeValue = attributes[attributeName];
            element.attr(attributeName, attributeValue);
        }
    }
    return elementNode;
}
