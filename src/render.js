import * as d3 from "d3-selection";
import {transition, attrTween} from "d3-transition";
import {createElement, extractElementData, replaceElement} from "./element";
import {shallowCopyObject} from "./utils";
import {convertToPathData} from "./svg";
import {createZoomBehavior, translateZoomTransform, translateZoomBehaviorTransform} from "./zoom";

export default function() {

    var transitionInstance = this._transition;
    var tweenPaths = this._tweenPaths
    var tweenShapes = this._tweenShapes
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

        if (transitionInstance) {
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
            childrenExit
              .filter(function(d) {
                  return d.tag[0] == '#' ? null : this;
              })
                .style("opacity", 0.0);
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
                    var prevData = extractElementData(child);
                    var prevPathData = convertToPathData(prevData);
                    var pathElement = replaceElement(child, prevPathData);
                    pathElement.data([childData], function () {
                        return childData.key;
                    });
                    var newPathData = convertToPathData(childData);
                    child = pathElement;
                    tag = 'path';
                    attributes = newPathData.attributes;
                    convertShape = true;
                }
            }
            var childTransition = child;
            if (transitionInstance) {
                childTransition = childTransition
                    .transition(transitionInstance);
                childTransition
                  .filter(function(d) {
                      return d.tag[0] == '#' ? null : this;
                  })
                    .style("opacity", 1.0);
            }
            var tweenThisPath = tweenPaths && transitionInstance && tag == 'path' && child.attr('d') != null;
            for (var attributeName of Object.keys(attributes)) {
                var attributeValue = attributes[attributeName];
                if (tweenThisPath && attributeName == 'd') {
                    childTransition
                        .attrTween("d", pathTween(attributeValue, tweenPrecision));
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

    function pathTween(d1, precision) {
        return function() {
            var path0 = this,
                path1 = path0.cloneNode(),
                n0 = path0.getTotalLength(),
                n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

            // Uniform sampling of distance based on specified precision.
            var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
            while ((i += dt) < 1) distances.push(i);
            distances.push(1);

            // Compute point-interpolators at each distance.
            var points = distances.map(function(t) {
                var p0 = path0.getPointAtLength(t * n0),
                    p1 = path1.getPointAtLength(t * n1);
                return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
            });

            return function(t) {
                return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
            };
        };
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
