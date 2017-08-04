import * as Viz from "viz.js";
import * as d3 from "d3-selection";
import {extractElementData, createElementWithAttributes} from "./element";
import {convertToPathData} from "./svg";
import {pathTweenPoints} from "./tweening";

export default function(src) {

    var engine = this._engine;
    var totalMemory = this._totalMemory;
    var keyMode = this._keyMode;
    var tweenPaths = this._tweenPaths
    var tweenShapes = this._tweenShapes
    var tweenPrecision = this._tweenPrecision
    var dictionary = {};
    var prevDictionary = this._dictionary || {};

    function extractData(element, index = 0, parentData) {

        var datum = extractElementData(element);

        datum.parent = parentData;
        datum.children = [];
        var tag = datum.tag;
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
        var id = (parentData ? parentData.id + '.' : '') + datum.key;
        datum.id = id;
        dictionary[id] = datum;
        var prevDatum = prevDictionary[id];
        if (tweenShapes && id in prevDictionary) {
            if ((prevDatum.tag == 'polygon' || prevDatum.tag == 'ellipse') && (prevDatum.tag != datum.tag || datum.tag == 'polygon')) {
                datum.alternativeOld = convertToPathData(prevDatum, datum);
                datum.alternativeNew = convertToPathData(datum, prevDatum);
            }
        }
        if (tweenPaths && prevDatum && (prevDatum.tag == 'path' || (datum.alternativeOld && datum.alternativeOld.tag == 'path'))) {
            var attribute_d = (datum.alternativeNew || datum).attributes.d;
            if (datum.alternativeOld) {
                var oldNode = createElementWithAttributes(datum.alternativeOld);
            } else {
                var oldNode = createElementWithAttributes(prevDatum);
            }
            (datum.alternativeOld || (datum.alternativeOld = {})).points = pathTweenPoints(oldNode, attribute_d, tweenPrecision);
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
                var childData = extractData(d3.select(this), childIndex, datum);
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
                  totalMemory: totalMemory,
              }
             );

    var newDoc = d3.select(document.createDocumentFragment())
      .append('div');

    newDoc
        .html(svgDoc);

    var newSvg = newDoc
      .select('svg');

    var data = extractData(newSvg);
    this._data = data;
    this._dictionary = dictionary;

    return this;
};
