import * as Viz from "viz.js";
import * as d3 from "d3-selection";
import {transition} from "d3-transition";

export default function(src, rootElement, transitionInstance) {

    function extractData(element) {

        var datum = {};
        var tag = element.node().nodeName;
        datum.tag = tag;
        datum.attributes = [];
        datum.children = [];
        var attributes = element.node().attributes;
        if (attributes) {
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                var name = attribute.name;
                var value = attribute.value;
                datum.attributes.push({'name': name, 'value': value});
            }
        }
        if (tag == '#text') {
            datum.text = element.text();
        } else if (tag == '#comment') {
            datum.comment = element.text();
        }
        var children = d3.selectAll(element.node().childNodes);
        children.each(function () {
            if (this !== null) {
                var childData = extractData(d3.select(this));
                if (childData) {
                    datum.children.push(childData);
                }
            }
        });
        return datum;
    }

    function insertSvg(element, data) {
        var children = element.selectAll(function () {
            return element.node().childNodes;
        });
        children = children
          .data(data, function (d, i, parent) {
              if (d.id) {
                  return d.id;
              } else {
                  return d.tag + '-' + i;
              }
          });
        var childrenEnter = children
          .enter()
          .append(function(d) {
              if (d.tag == '#text') {
                  return document.createTextNode(d.text);
              } else if (d.tag == '#comment') {
                  return document.createComment(d.comment);
              } else {
                  return document.createElementNS('http://www.w3.org/2000/svg', d.tag);
              }
          });

        var childrenExit = children
          .exit();
        if (transitionInstance) {
            childrenExit = childrenExit
                .transition(transitionInstance);
        }
        childrenExit = childrenExit
            .remove()
        children = childrenEnter
            .merge(children);
        children.each(function(childData) {
            var child = d3.select(this);
            var childTransition = child;
            if (transitionInstance) {
                childTransition = childTransition
                    .transition(transitionInstance);
            }
            childData.attributes.forEach(function(attribute) {
                childTransition
                    .attr(attribute.name, attribute.value);
            });
            if (childData.text) {
                childTransition
                    .text(childData.text);
            }
            insertSvg(child, childData.children);
        });
    }

    var svgDoc = Viz(src,
              {
                  format: "svg",
                  engine: "dot"
              }
             );

    var newDoc = d3.select(document.createDocumentFragment())
      .append('div');

    newDoc
        .html(svgDoc);

    var newSvg = newDoc
      .select('svg');

    var data = extractData(newSvg);

    var root = d3.select(rootElement);
    insertSvg(root, [data]);

};
