// FIXME: These functions are just copied from ../src/svg.js
//        Find a way to import them instead

var roundTo4Decimals = require("./utils").roundTo4Decimals;

module.exports.translatePointsAttribute = function(pointsString, x, y) {
    var pointStrings = pointsString.split(' ');
    var points = pointStrings.map(function(p) {return p.split(',')});
    var points = pointStrings.map(function(p) {return [roundTo4Decimals(+x + +p.split(',')[0]), roundTo4Decimals(+y + +p.split(',')[1])]});
    var pointStrings = points.map(function(p) {return p.join(',')});
    var pointsString = pointStrings.join(' ');
    pointsString = pointsString.replace(/-0\./g, '-.').replace(/ 0\./g, ' .');
    return pointsString;
}

module.exports.translateDAttribute = function translateDAttribute(d, x, y) {
    var pointStrings = d.split(/[A-Z ]/);
    pointStrings.shift();
    var commands = d.split(/[^[A-Z ]+/);
    var points = pointStrings.map(function(p) {return p.split(',')});
    var points = pointStrings.map(function(p) {return [roundTo4Decimals(+x + +p.split(',')[0]), roundTo4Decimals(+y + +p.split(',')[1])]});
    var pointStrings = points.map(function(p) {return p.join(',')});
    d = commands.reduce(function(arr, v, i) {
        return arr.concat(v, pointStrings[i]);
    }, []).join('');
    d = d.replace(/-0\./g, '-.').replace(/ 0\./g, ' .');
    return d;
}
