import * as Viz from "viz.js";
import * as d3 from "d3-selection";

export default function(src, rootElement) {

    function extractData(element) {

        var datum = {};
        var tag = element.node().nodeName;
        if (tag[0] == '#') {
            // Skip close tag
            return null;
        }
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
        if (tag == 'text' || tag == 'title') {
            var text = element.text();
            datum.text = text;
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
        var children = element.selectAll('*')
          .data(data);
        var childrenEnter = children
          .enter()
        childrenEnter.each(function(childData) {
            var child = d3.select(this)
              .append(childData.tag);
            childData.attributes.forEach(function(attribute) {
                child.attr(attribute.name, attribute.value);
            });
            if (childData.text) {
                child.text(childData.text);
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

    var svg = d3.select(rootElement)
      .select('svg');

    return svg;
};
