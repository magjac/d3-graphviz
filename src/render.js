import * as d3 from "d3-selection";
import {transition} from "d3-transition";
import {timeout} from "d3-timer";
import {interpolateTransformSvg} from "d3-interpolate";
import {zoomTransform} from "d3-zoom";
import {createElement, extractElementData, replaceElement} from "./element.js";
import {createZoomBehavior, getTranslatedZoomTransform, translateZoomBehaviorTransform} from "./zoom.js";
import {pathTween} from "./tweening.js";
import {isEdgeElement} from "./data.js";
import {isEdgeElementParent} from "./data.js";

export default function(callback) {

    if (this._busy) {
        this._queue.push(this.render.bind(this, callback));
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
    var fade = this._options.fade && transitionInstance != null;
    var tweenPaths = this._options.tweenPaths;
    var tweenShapes = this._options.tweenShapes;
    var convertEqualSidedPolygons = this._options.convertEqualSidedPolygons;
    var growEnteringEdges = this._options.growEnteringEdges && transitionInstance != null;
    var attributer = this._attributer;
    var graphvizInstance = this;

    function insertChildren(element) {
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
        children.each(attributeElement);
    }

    function attributeElement(data) {
        var element = d3.select(this);
        if (data.tag == "svg") {
            var options = graphvizInstance._options;
            if (options.width != null || options.height != null) {
                var width = options.width;
                var height = options.height;
                if (width == null) {
                    width = data.attributes.width.replace('pt', '') * 4 / 3;
                } else {
                    element
                        .attr("width", width);
                    data.attributes.width = width;
                }
                if (height == null) {
                    height = data.attributes.height.replace('pt', '') * 4 / 3;
                } else {
                    element
                        .attr("height", height);
                    data.attributes.height = height;
                }
                if (!options.fit) {
                    element
                        .attr("viewBox", `0 0 ${width * 3 / 4 / options.scale} ${height * 3 / 4 / options.scale}`);
                    data.attributes.viewBox = `0 0 ${width * 3 / 4 / options.scale} ${height * 3 / 4 / options.scale}`;
                }
            }
            if (options.scale != 1 && (options.fit || (options.width == null && options.height == null))) {
                width = data.attributes.viewBox.split(' ')[2];
                height = data.attributes.viewBox.split(' ')[3];
                element
                    .attr("viewBox", `0 0 ${width / options.scale} ${height / options.scale}`);
                data.attributes.viewBox = `0 0 ${width / options.scale} ${height / options.scale}`;
            }
        }
        if (attributer) {
            element.each(attributer);
        }
        var tag = data.tag;
        var attributes = data.attributes;
        var currentAttributes = element.node().attributes;
        if (currentAttributes) {
            for (var i = 0; i < currentAttributes.length; i++) {
                var currentAttribute = currentAttributes[i];
                var name = currentAttribute.name;
                if (name.split(':')[0] != 'xmlns' && currentAttribute.namespaceURI) {
                    var namespaceURIParts = currentAttribute.namespaceURI.split('/');
                    var namespace = namespaceURIParts[namespaceURIParts.length - 1];
                    name = namespace + ':' + name;
                }
                if (!(name in attributes)) {
                    attributes[name] = null;
                }
            }
        }
        var convertShape = false;
        var convertPrevShape = false;
        if (tweenShapes && transitionInstance) {
            if ((this.nodeName == 'polygon' || this.nodeName == 'ellipse') && data.alternativeOld) {
                convertPrevShape = true;
            }
            if ((tag == 'polygon' || tag == 'ellipse') && data.alternativeNew) {
                convertShape = true;
            }
            if (this.nodeName == 'polygon' && tag == 'polygon' && data.alternativeOld) {
                var prevData = extractElementData(element);
                var prevPoints = prevData.attributes.points;
                if (!convertEqualSidedPolygons) {
                    var nPrevPoints = prevPoints.split(' ').length;
                    var points = data.attributes.points;
                    var nPoints = points.split(' ').length;
                    if (nPoints == nPrevPoints) {
                        convertShape = false;
                        convertPrevShape = false;
                    }
                }
            }
            if (convertPrevShape) {
                var prevPathData = data.alternativeOld;
                var pathElement = replaceElement(element, prevPathData);
                pathElement.data([data], function () {
                    return data.key;
                });
                element = pathElement;
            }
            if (convertShape) {
                var newPathData = data.alternativeNew;
                tag = 'path';
                attributes = newPathData.attributes;
            }
        }
        var elementTransition = element;
        if (transitionInstance) {
            elementTransition = elementTransition
                .transition(transitionInstance);
            if (fade) {
                elementTransition
                  .filter(function(d) {
                      return d.tag[0] == '#' ? null : this;
                  })
                    .style("opacity", 1.0);
            }
            elementTransition
              .filter(function(d) {
                  return d.tag[0] == '#' ? null : this;
              })
                .on("end", function(d) {
                    d3.select(this)
                        .attr('style', (d && d.attributes && d.attributes.style) || null);
                });
        }
        var growThisPath = growEnteringEdges && tag == 'path' && data.offset;
        if (growThisPath) {
            var totalLength = data.totalLength;
            element
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .attr('transform', 'translate(' + data.offset.x + ',' + data.offset.y + ')');
            attributes["stroke-dashoffset"] = 0;
            attributes['transform'] = 'translate(0,0)';
            elementTransition
                .attr("stroke-dashoffset", attributes["stroke-dashoffset"])
                .attr('transform', attributes['transform'])
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
        var moveThisPolygon = growEnteringEdges && tag == 'polygon' && isEdgeElement(data) && data.offset && data.parent.children[3].tag == 'path';
        if (moveThisPolygon) {
            var edgePath = d3.select(element.node().parentNode.querySelector("path"));
            var p0 = edgePath.node().getPointAtLength(0);
            var p1 = edgePath.node().getPointAtLength(data.totalLength);
            var p2 = edgePath.node().getPointAtLength(data.totalLength - 1);
            var angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI;
            var x = p0.x - p1.x + data.offset.x;
            var y = p0.y - p1.y + data.offset.y;
            element
                .attr('transform', 'translate(' + x + ',' + y + ')');
            elementTransition
                .attrTween("transform", function () {
                    return function (t) {
                        var p = edgePath.node().getPointAtLength(data.totalLength * t);
                        var p2 = edgePath.node().getPointAtLength(data.totalLength * t + 1);
                        var angle = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI - angle1;
                        x = p.x - p1.x + data.offset.x * (1 - t);
                        y = p.y - p1.y + data.offset.y * (1 - t);
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
        var tweenThisPath = tweenPaths && transitionInstance && tag == 'path' && element.attr('d') != null;
        for (var attributeName of Object.keys(attributes)) {
            var attributeValue = attributes[attributeName];
            if (tweenThisPath && attributeName == 'd') {
                var points = (data.alternativeOld || data).points;
                if (points) {
                    elementTransition
                        .attrTween("d", pathTween(points, attributeValue));
                }
            } else {
                if (attributeName == 'transform' && data.translation) {
                    if (transitionInstance) {
                        var onEnd = elementTransition.on("end");
                        elementTransition
                            .on("start", function () {
                                if (graphvizInstance._zoomBehavior) {
                                    // Update the transform to transition to, just before the transition starts
                                    // in order to catch changes between the transition scheduling to its start.
                                    elementTransition
                                        .tween("attr.transform", function() {
                                            var node = this;
                                            return function(t) {
                                                node.setAttribute("transform", interpolateTransformSvg(zoomTransform(graphvizInstance._zoomSelection.node()).toString(), getTranslatedZoomTransform.call(graphvizInstance, element).toString())(t));
                                            };
                                        });
                                }
                            })
                            .on("end", function () {
                                onEnd.call(this);
                                // Update the zoom transform to the new translated transform
                                if (graphvizInstance._zoomBehavior) {
                                    translateZoomBehaviorTransform.call(graphvizInstance, element);
                                }
                            })
                    } else {
                        if (graphvizInstance._zoomBehavior) {
                            // Update the transform attribute to set with the current pan translation
                            translateZoomBehaviorTransform.call(graphvizInstance, element);
                            attributeValue = getTranslatedZoomTransform.call(graphvizInstance, element).toString();
                        }
                    }
                }
                elementTransition
                    .attr(attributeName, attributeValue);
            }
        }
        if (convertShape) {
            elementTransition
                .on("end", function (d, i, nodes) {
                    pathElement = d3.select(this);
                    var newElement = replaceElement(pathElement, d);
                    newElement.data([d], function () {
                        return d.key;
                    });
                })
        }
        if (data.text) {
            elementTransition
                .text(data.text);
        }
        insertChildren(element);
    }

    var root = this._selection;

    if (transitionInstance != null) {
        // Ensure original SVG shape elements are restored after transition before rendering new graph
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

    var svg = root
      .selectAll("svg")
        .data([data], function (d) {return d.key});
    svg = svg
      .enter()
      .append("svg")
      .merge(svg);

    attributeElement.call(svg.node(), data);


    if (this._options.zoom && !this._zoomBehavior) {
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
