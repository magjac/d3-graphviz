import * as Viz from "viz.js";
import * as d3 from "d3-selection";

export default function(src) {

    var engine = this._engine;
    var keyMode = this._keyMode;
    var tweenShapes = this._tweenShapes

    function extractData(element, keyMode, index = 0) {

        var datum = {};
        var tag = element.node().nodeName;
        datum.tag = tag;
        datum.attributes = {};
        datum.children = [];
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
        var children = d3.selectAll(element.node().childNodes);
        if (keyMode == 'index') {
            datum.key = index;
        } else if (tag[0] != '#') {
            if (keyMode == 'id') {
                datum.key = element.attr('id');
            } else if (keyMode == 'title') {
                element.select('title');
                var title = element.select('title');
                if (!title.empty()) {
                    datum.key = element.select('title').text();
                }
            }
        }
        if (datum.key == null) {
            if (tweenShapes) {
                if (tag == 'ellipse' || tag == 'polygon') {
                    tag = 'path';
                }
            }
            datum.key = tag + '-' + index;
        }
        var childTagIndexes = {};
        children.each(function () {
            if (this !== null) {
                var childTag = this.nodeName;
                if (childTag == 'ellipse' || childTag == 'polygon') {
                    childTag = 'path';
                }
                if (childTagIndexes[childTag] == null) {
                    childTagIndexes[childTag] = 0;
                }
                var childIndex = childTagIndexes[childTag]++;
                var childData = extractData(d3.select(this), keyMode, childIndex);
                if (childData) {
                    datum.children.push(childData);
                }
            }
        });
        return datum;
    }

    var svgDoc = Viz(src,
              {
                  format: "svg",
                  engine: engine,
              }
             );

    var newDoc = d3.select(document.createDocumentFragment())
      .append('div');

    newDoc
        .html(svgDoc);

    var newSvg = newDoc
      .select('svg');

    var data = extractData(newSvg, keyMode);
    this._data = data;

    return this;
};
