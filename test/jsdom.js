import jsdom from "jsdom";
import "./polyfill_btoa.js";
import "./polyfill_navigator.js";

export default function jsdomit(html, options) {
    var dom = new jsdom.JSDOM(html, options);
    var window = dom.window;

    window.SVGElement.prototype.getPointAtLength = function (distance) {
        if (this.nodeName != 'path') {
            throw 'jsdom.js: getPointAtLength: unexpected element ' + this.nodeName;
        }
        return {
            x: distance * 100.0,
            y: distance * 100.0,
        }
    }
    window.SVGElement.prototype.getTotalLength = function () {
        if (this.nodeName != 'path') {
            throw 'jsdom.js: getTotalLength: unexpected element ' + this.nodeName;
        }
        return 100.0;
    }
    window.SVGElement.prototype.getBBox = function () {

        if (this.getAttribute('points')) {
            var points = this.getAttribute('points').split(' ');
            var x = points.map(function(p) {return +p.split(',')[0]});
            var y = points.map(function(p) {return +p.split(',')[1]});
            var xmin = Math.min.apply(null, x);
            var xmax = Math.max.apply(null, x);
            var ymin = Math.min.apply(null, y);
            var ymax = Math.max.apply(null, y);
        } else if (this.getAttribute('cx')) {
            var cx = +this.getAttribute('cx');
            var cy = +this.getAttribute('cy');
            var rx = +this.getAttribute('rx');
            var ry = +this.getAttribute('ry');
            var xmin = cx - rx;
            var xmax = cx + rx;
            var ymin = cy - ry;
            var ymax = cy + ry;
        } else if (this.getAttribute('x')) {
            var x = +this.getAttribute('x');
            var y = +this.getAttribute('y');
            var xmin = x;
            var xmax = x + 0;
            var ymin = y;
            var ymax = y + 0;
        } else if (this.getAttribute('d')) {
            var d = this.getAttribute('d');
            var points = d.split(/[A-Z ]/);
            points.shift();
            var x = points.map(function(p) {return +p.split(',')[0]});
            var y = points.map(function(p) {return +p.split(',')[1]});
            var xmin = Math.min.apply(null, x);
            var xmax = Math.max.apply(null, x);
            var ymin = Math.min.apply(null, y);
            var ymax = Math.max.apply(null, y);
        } else {
            throw "WTF!" + this;
        }
        var bbox = {
            x: xmin,
            y: ymin,
            width: xmax - xmin,
            height: ymax - ymin,
        };
        return bbox;
    }
    if (!('width' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'width', {
            get: function() {
                return {
                    baseVal: {
                            value: +this.getAttribute('width').replace('pt', ''),
                    }
                };
            }
        });
    }
    if (!('height' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'height', {
            get: function() {
                return {
                    baseVal: {
                        value: +this.getAttribute('height').replace('pt', ''),
                    }
                };
            }
        });
    }
    if (!('transform' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'transform', {
            get: function() {
                const transform = this.getAttribute('transform');
                if (transform) {
                    var translate = transform.replace(/.*translate\((-*[\d.]+[ ,]+-*[\d.]+)\).*/, function(match, xy) {
                        return xy;
                    }).split(/[ ,]+/).map(function(v) {
                        return +v;
                    });
                    var scale = transform.replace(/.*.*scale\((-*[\d.]+[ ,]*-*[\d.]*)\).*/, function(match, scale) {
                        return scale;
                    }).split(/[ ,]+/).map(function(v) {
                        return +v;
                    });
                    return {
                        baseVal: {
                            numberOfItems: 1,
                            consolidate: function() {
                                return {
                                    matrix: {
                                        'a': scale[0],
                                        'b': 0,
                                        'c': 0,
                                        'd': scale[1] || scale[0],
                                        'e': translate[0],
                                        'f': translate[1],
                                    }
                                };
                            },
                        },
                    };
                } else {
                    return {
                        baseVal: {
                            numberOfItems: 0,
                            consolidate: function() {
                                return null;
                            },
                        },
                    };
                }
            },
        });
    }
    if (!('viewBox' in window.SVGElement.prototype)) {
        Object.defineProperty(window.SVGElement.prototype, 'viewBox', {
            get: function() {
                let viewBox = this.getAttribute('viewBox').split(' ');
                return {
                    baseVal: {
                        x: +viewBox[0],
                        y: +viewBox[1],
                        width: +viewBox[2],
                        height: +viewBox[3],
                    },
                };
            },
        });
    }

    global.SVGElement = window.SVGElement;

    Object.defineProperty(window.document, "currentScript", {
        get() { return {src: './node_modules/@hpcc-js/wasm/dist/index.js'}; }
    });

    return dom.window
};
