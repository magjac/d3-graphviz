import * as d3 from "d3-selection";
import {transition, attrTween} from "d3-transition";
import {createElement, extractElementData, replaceElement} from "./element";
import {shallowCopyObject} from "./utils";
import {createZoomBehavior, translateZoomTransform, translateZoomBehaviorTransform} from "./zoom";
import {pathTween} from "./tweening";

export default function() {

    var transitionInstance = this._transition;
    var fade = this._fade
    var tweenPaths = this._tweenPaths
    var tweenShapes = this._tweenShapes
    var convertEqualSidedPolygons = this._convertEqualSidedPolygons;
    var tweenPrecision = this._tweenPrecision
    var attributer = this._attributer
    var graphvizInstance = this;

    function insertSvg(element) {
        var children = element.selectAll(function () {
            return element.node().childNodes;
        });

        children = children
          .data(function (d) {
              return d.children;
          }, function (d) {
              return d.key;
          });
        var childrenEnter = children
          .enter()
          .append(function(d) {
              return createElement(d);
          });

        if (transitionInstance && fade) {
            childrenEnter
                .filter(function(d) {
                    return d.tag[0] == '#' ? null : this;
                })
                .style("opacity", 0.0);
        }
        var childrenExit = children
          .exit();
        if (attributer) {
            childrenExit.each(attributer);
        }
        if (transitionInstance) {
            childrenExit = childrenExit
                .transition(transitionInstance);
            if (fade) {
                childrenExit
                  .filter(function(d) {
                      return d.tag[0] == '#' ? null : this;
                  })
                    .style("opacity", 0.0);
            }
        }
        childrenExit = childrenExit
            .remove()
        children = childrenEnter
            .merge(children);
        if (attributer) {
            children.each(attributer);
        }
        children.each(function(childData) {
            var child = d3.select(this);
            var tag = childData.tag;
            var attributes = childData.attributes;
            var convertShape = false;
            if (tweenShapes && transitionInstance) {
                if (this.nodeName == 'polygon' || this.nodeName == 'ellipse') {
                    convertShape = true;
                    var prevData = extractElementData(child);
                    if (this.nodeName == 'polygon' && tag == 'polygon') {
                        var prevPoints = prevData.attributes.points;
                        if (prevPoints == null) {
                            convertShape = false;
                        } else if (!convertEqualSidedPolygons) {
                            var nPrevPoints = prevPoints.split(' ').length;
                            var points = childData.attributes.points;
                            var nPoints = points.split(' ').length;
                            if (nPoints == nPrevPoints) {
                                convertShape = false;
                            }
                        }
                    } else if (this.nodeName == 'ellipse' && tag == 'ellipse') {
                        convertShape = false;
                    }
                }
                if (convertShape) {
                    var prevPathData = childData.alternativeOld;
                    var pathElement = replaceElement(child, prevPathData);
                    pathElement.data([childData], function () {
                        return childData.key;
                    });
                    var newPathData = childData.alternativeNew;
                    child = pathElement;
                    tag = 'path';
                    attributes = newPathData.attributes;
                }
            }
            var childTransition = child;
            if (transitionInstance) {
                childTransition = childTransition
                    .transition(transitionInstance);
                if (fade) {
                    childTransition
                      .filter(function(d) {
                          return d.tag[0] == '#' ? null : this;
                      })
                        .style("opacity", 1.0);
                }
            }
            var tweenThisPath = tweenPaths && transitionInstance && tag == 'path' && child.attr('d') != null;
            for (var attributeName of Object.keys(attributes)) {
                var attributeValue = attributes[attributeName];
                if (tweenThisPath && attributeName == 'd') {
                    var points = (childData.alternativeOld || childData).points;
                    childTransition
                        .attrTween("d", pathTween(points, attributeValue));
                } else {
                    if (attributeName == 'transform' && childData.translation) {
                        childTransition
                            .on("start", function () {
                                if (graphvizInstance._zoomBehavior) {
                                    childTransition
                                        .attr(attributeName, translateZoomTransform.call(graphvizInstance, child).toString());
                                }
                            })
                            .on("end", function () {
                                if (graphvizInstance._zoomBehavior) {
                                    translateZoomBehaviorTransform.call(graphvizInstance, child);
                                }
                            })
                    }
                    childTransition
                        .attr(attributeName, attributeValue);
                }
            }
            if (convertShape) {
                childTransition
                    .on("end", function (d, i, nodes) {
                        if (this.nodeName != d.tag) {
                            pathElement = d3.select(this);
                            var newElement = replaceElement(pathElement, d);
                            newElement.data([d], function () {
                                return d.key;
                            });
                        }
                    })
            }
            if (childData.text) {
                childTransition
                    .text(childData.text);
            }
            insertSvg(child);
        });
    }

    var root = this._selection;

    if (transitionInstance != null) {
        // Ensure orignal SVG shape elements are restored after transition before rendering new graph
        var jobs = this._jobs;
        if (graphvizInstance._active) {
            jobs.push(null);
            return this;
        } else {
            root
              .transition(transitionInstance)
              .transition()
                .duration(0)
                .on("end" , function () {
                    graphvizInstance._active = false;
                    if (jobs.length != 0) {
                        jobs.shift();
                        graphvizInstance.render();
                    }
                });
            this._active = true;
        }
    }

    var data = this._data;

    root
        .datum({children: [data]});
    insertSvg(root);

    if (this._zoom && !this._zoomBehavior) {
        createZoomBehavior.call(this);
    }

    return this;
};
