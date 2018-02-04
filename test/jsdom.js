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
    global.SVGElement = window.SVGElement;

    return dom.window
};
