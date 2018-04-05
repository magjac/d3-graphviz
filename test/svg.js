module.exports = function(pointsString, x, y) {
    var pointStrings = pointsString.split(' ');
    var points = pointStrings.map(function(p) {return p.split(',')});
    var points = pointStrings.map(function(p) {return [+x + +p.split(',')[0], +y + +p.split(',')[1]]});
    var pointStrings = points.map(function(p) {return p.join(',')});
    var pointsString = pointStrings.join(' ');
    return pointsString;
}
