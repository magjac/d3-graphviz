import * as d3 from "d3-selection";
import {transition, attrTween} from "d3-transition";
import {createElement} from "./element";
import {shallowCopyObject} from "./utils";

export default function(rootElement) {

    var transitionInstance = this._transition;
    var tweenPaths = this._tweenPaths
    var tweenShapes = this._tweenShapes

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
              data = d;
              if (tweenShapes && (d.tag == 'ellipse' || d.tag == 'polygon')) {
                  data = shallowCopyObject(d);
                  data.tag = 'path';
              }
              return createElement(data);
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
        children.each(function(childData) {
            var child = d3.select(this);
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
            var tag = childData.tag;
            var attributes = childData.attributes;
            if (tweenShapes) {
                if (this.nodeName == 'path' && childData.tag == 'polygon') {
                    tag = 'path';
                    attributes['d'] = 'M' + attributes.points + 'z';
                    delete attributes.points;
                }
                if (this.nodeName == 'path' && childData.tag == 'ellipse') {
                    tag = 'path';
                    var cx = attributes.cx;
                    var cy = attributes.cy;
                    var rx = attributes.rx;
                    var ry = attributes.ry;
                    // FIXME: TODO compute automatically when original tag is restored after transition
                    // Start the ellipse at 30 deg to be close to rectangle start point
                    var angle = Math.PI / 6;
                    var x1 = rx * Math.cos(angle);
                    var y1 = -ry * Math.sin(angle);
                    var x2 = rx * Math.cos(angle + Math.PI);
                    var y2 = -ry * Math.sin(angle + Math.PI);
                    var dx = x2 - x1;
                    var dy = y2 - y1;
                    attributes['d'] = 'M '  +  cx + ' ' + cy + ' m ' + x1 + ',' + y1 + ' a ' + rx + ',' + ry + ' 0 1,0 ' + dx + ',' + dy + ' a ' + rx + ',' + ry + ' 0 1,0 ' + -dx + ',' + -dy + 'z';
                    delete attributes.cx;
                    delete attributes.cy;
                    delete attributes.rx;
                    delete attributes.ry;
                }
            }
            for (var attributeName of Object.keys(attributes)) {
                var attributeValue = attributes[attributeName];
                if (tweenPaths && transitionInstance && tag == 'path' && attributeName == 'd' && child.attr('d') != null) {
                    childTransition
                        .attrTween("d", pathTween(attributeValue, 4));
                } else {
                    childTransition
                        .attr(attributeName, attributeValue);
                }
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

    var root = d3.select(rootElement);
    if (root.empty()) {
        root = this._selection;
    } else {
        if (this._selection != null) {
            throw new Error('Multiply specified selection to render on');
        }
    }

    var data = this._data;

    root
        .datum({children: [data]});
    insertSvg(root);

    return this;
};
