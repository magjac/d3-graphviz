import * as d3 from "d3-selection";
import {getTranslation} from "./zoom";

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
    var transform = element.node().transform;
    if (transform) {
        var translation = getTranslation(element);
        if (translation.x != 0 || translation.y != 0) {
            datum.translation = translation;
        }
    }
    if (tag == 'ellipse' && datum.attributes.cx) {
        datum.center = {
            x: datum.attributes.cx,
            y: datum.attributes.cy,
        };
    }
    if (tag == 'polygon' && datum.attributes.points) {
        var points = element.attr('points').split(' ');
        var x = points.map(function(p) {return p.split(',')[0]});
        var y = points.map(function(p) {return p.split(',')[1]});
        var xmin = Math.min.apply(null, x);
        var xmax = Math.max.apply(null, x);
        var ymin = Math.min.apply(null, y);
        var ymax = Math.max.apply(null, y);
        var bbox = {
            x: xmin,
            y: ymin,
            width: xmax - xmin,
            height: ymax - ymin,
        };
        datum.bbox = bbox;
        datum.center = {
            x: ymin + ymax / 2,
            y: ymin + ymax / 2,
        };
    }
    if (tag == 'path') {
        if (element.node().getTotalLength) {
            datum.totalLength = element.node().getTotalLength();
        } else { // Test workaround until https://github.com/tmpvar/jsdom/issues/1330 is fixed
            datum.totalLength = 100;
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
        return document.createTextNode("");
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

export function replaceElement(element, data) {
    var parent = d3.select(element.node().parentNode);
    var newElementNode = createElementWithAttributes(data);
    var newElement = parent.insert(function () {
        return newElementNode;
    }, function () {
        return element.node();
    });
    element.remove();
    return newElement;
}
