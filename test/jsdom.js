var jsdom = require("jsdom");

module.exports = function(html, options) {
    var dom = new jsdom.JSDOM(html, options);
    var window = dom.window;

    window.SVGElement.prototype.getPointAtLength = function (distance) {
        return {
            x: distance * 100.0,
            y: distance * 100.0,
        }
    }
    window.SVGElement.prototype.getTotalLength = function () {
        return 100.0;
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
                if (this.getAttribute('transform')) {
                    var translate = this.getAttribute('transform').replace(/.*translate\((\d+[ ,]+\d+)\).*/, function(match, xy) {
                        return xy;
                    }).split(/[ ,]+/).map(function(v) {
                        return +v;
                    });
                    var scale = this.getAttribute('transform').replace(/.*.*scale\((\d+[ ,]*\d*)\).*/, function(match, scale) {
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

    global.SVGElement = window.SVGElement;

    return dom.window
};
