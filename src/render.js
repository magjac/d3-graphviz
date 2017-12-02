import * as d3 from "d3-selection";
import {transition, attrTween} from "d3-transition";
import {timeout} from "d3-timer";
import {createElement, extractElementData, replaceElement} from "./element";
import {shallowCopyObject} from "./utils";
import {createZoomBehavior, translateZoomTransform, translateZoomBehaviorTransform} from "./zoom";
import {pathTween} from "./tweening";
import {isEdgeElement} from "./data";
import {isEdgeElementParent} from "./data";

export default function(callback) {

    if (this._busy) {
        this._queue.push(this.render);
        return this;
    }
    this._dispatch.call('renderStart', this);

    if (this._transitionFactory) {
        timeout(function () { // Decouple from time spent. See https://github.com/d3/d3-timer/issues/27
            this._transition = transition(this._transitionFactory());
            _render.call(this, callback);
        }.bind(this), 0);
    } else {
        _render.call(this, callback);
    }
    return this;
}

function _render(callback) {

    var transitionInstance = this._transition;
    var fade = this._fade && transitionInstance != null;
    var tweenPaths = this._tweenPaths;
    var tweenShapes = this._tweenShapes;
    var convertEqualSidedPolygons = this._convertEqualSidedPolygons;
    var tweenPrecision = this._tweenPrecision;
    var growEnteringEdges = this._growEnteringEdges && transitionInstance != null;
    var attributer = this._attributer;
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
              var element = createElement(d);
              if (d.tag == '#text' && fade) {
                  element.nodeValue = d.text;
              }
              return element;
          });

        if (fade || (growEnteringEdges && isEdgeElementParent(element.datum()))) {
            var childElementsEnter = childrenEnter
                .filter(function(d) {
                    return d.tag[0] == '#' ? null : this;
                })
                .each(function (d) {
                    var childEnter = d3.select(this);
                    for (var attributeName of Object.keys(d.attributes)) {
                        var attributeValue = d.attributes[attributeName];
                        childEnter
                            .attr(attributeName, attributeValue);
                    }
                });
            childElementsEnter
              .filter(function(d) {
                    return d.tag == 'svg' || d.tag == 'g' ? null : this;
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
            if (tweenShapes && transitionInstance && childData.alternativeOld) {
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
                childTransition
                  .filter(function(d) {
                      return d.tag[0] == '#' ? null : this;
                  })
                    .on("end", function() {
                        d3.select(this)
                            .attr('style', null);
                    });
            }
            var growThisPath = growEnteringEdges && tag == 'path' && childData.offset;
            if (growThisPath) {
                var totalLength = childData.totalLength;
                child
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .attr('transform', 'translate(' + childData.offset.x + ',' + childData.offset.y + ')');
                childTransition
                    .attr("stroke-dashoffset", 0)
                    .attr('transform', 'translate(0,0)')
                    .on("start", function() {
                        d3.select(this)
                            .style('opacity', null);
                    })
                    .on("end", function() {
                        d3.select(this)
                            .attr('stroke-dashoffset', null)
                            .attr('stroke-dasharray', null)
                            .attr('transform', null);
                    });
            }
            var moveThisPolygon = growEnteringEdges && tag == 'polygon' && isEdgeElement(childData) && childData.offset;
            if (moveThisPolygon) {
                var edgePath = d3.select(element.node().querySelector("path"));
                if (edgePath.node().getPointAtLength) {
                    var p0 = edgePath.node().getPointAtLength(0);
                    var p1 = edgePath.node().getPointAtLength(childData.totalLength);
                    var p2 = edgePath.node().getPointAtLength(childData.totalLength - 1);
                    var angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI;
                } else { // Test workaround until https://github.com/tmpvar/jsdom/issues/1330 is fixed
                    var p0 = {x: 0, y: 0};
                    var p1 = {x: 100, y: 100};
                    var angle1 = 0;
                }
                var x = p0.x - p1.x + childData.offset.x;
                var y = p0.y - p1.y + childData.offset.y;
                child
                    .attr('transform', 'translate(' + x + ',' + y + ')');
                childTransition
                    .attrTween("transform", function () {
                        return function (t) {
                            if (edgePath.node().getPointAtLength) {
                                var p = edgePath.node().getPointAtLength(childData.totalLength * t);
                                var p2 = edgePath.node().getPointAtLength(childData.totalLength * t + 1);
                                var angle = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI - angle1;
                            } else { // Test workaround until https://github.com/tmpvar/jsdom/issues/1330 is fixed
                                var p = {x: 100.0 * t, y: 100.0 *t};
                                var angle = 0;
                            }
                            x = p.x - p1.x + childData.offset.x * (1 - t);
                            y = p.y - p1.y + childData.offset.y * (1 - t);
                            return 'translate(' + x + ',' + y + ') rotate(' + angle + ' ' + p1.x + ' ' + p1.y + ')';
                        }
                    })
                    .on("start", function() {
                        d3.select(this)
                            .style('opacity', null);
                    })
                    .on("end", function() {
                        d3.select(this).attr('transform', null);
                    });
            }
            var tweenThisPath = tweenPaths && transitionInstance && tag == 'path' && child.attr('d') != null;
            for (var attributeName of Object.keys(attributes)) {
                var attributeValue = attributes[attributeName];
                if (tweenThisPath && attributeName == 'd') {
                    var points = (childData.alternativeOld || childData).points;
                    if (points) {
                        childTransition
                            .attrTween("d", pathTween(points, attributeValue));
                    }
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

    if (transitionInstance != null) {
        root
          .transition(transitionInstance)
            .on("start" , function () {
                graphvizInstance._dispatch.call('transitionStart', graphvizInstance);
            })
            .on("end" , function () {
                graphvizInstance._dispatch.call('transitionEnd', graphvizInstance);
            })
          .transition()
            .duration(0)
            .on("start" , function () {
                graphvizInstance._dispatch.call('restoreEnd', graphvizInstance);
                graphvizInstance._dispatch.call('end', graphvizInstance);
                if (callback) {
                    callback.call(graphvizInstance);
                }
            });
    }

    var data = this._data;

    root
        .datum({attributes: {}, children: [data]});
    insertSvg(root);

    if (this._zoom && !this._zoomBehavior) {
        createZoomBehavior.call(this);
    }

    graphvizInstance._dispatch.call('renderEnd', graphvizInstance);

    if (transitionInstance == null) {
        this._dispatch.call('end', this);
        if (callback) {
            callback.call(this);
        }
    }

    return this;
};
