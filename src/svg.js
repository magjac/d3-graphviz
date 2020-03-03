import {shallowCopyObject} from "./utils";
import {roundTo2Decimals} from "./utils";

export function convertToPathData(originalData, guideData) {
    if (originalData.tag == 'polygon') {
        var newData = shallowCopyObject(originalData);
        newData.tag = 'path';
        var originalAttributes = originalData.attributes;
        var newAttributes = shallowCopyObject(originalAttributes);
        var newPointsString = originalAttributes.points;
        if (guideData.tag == 'polygon') {
            var bbox = originalData.bbox;
            bbox.cx = bbox.x + bbox.width / 2;
            bbox.cy = bbox.y + bbox.height / 2;
            var pointsString = originalAttributes.points;
            var pointStrings = pointsString.split(' ');
            var normPoints = pointStrings.map(function(p) {var xy = p.split(','); return [xy[0] - bbox.cx, xy[1] - bbox.cy]});
            var x0 = normPoints[normPoints.length - 1][0];
            var y0 = normPoints[normPoints.length - 1][1];
            for (var i = 0; i < normPoints.length; i++, x0 = x1, y0 = y1) {
                var x1 = normPoints[i][0];
                var y1 = normPoints[i][1];
                var dx = x1 - x0;
                var dy = y1 - y0;
                if (dy == 0) {
                    continue;
                } else {
                    var x2 = x0 - y0 * dx / dy;
                }
                if (0 <= x2 && x2 < Infinity && ((x0 <= x2 && x2 <= x1) || (x1 <= x2 && x2 <= x0))) {
                    break;
                }
            }
            var newPointStrings = [[bbox.cx + x2, bbox.cy + 0].join(',')];
            newPointStrings = newPointStrings.concat(pointStrings.slice(i));
            newPointStrings = newPointStrings.concat(pointStrings.slice(0, i));
            newPointsString = newPointStrings.join(' ');
        }
        newAttributes['d'] = 'M' + newPointsString + 'z';
        delete newAttributes.points;
        newData.attributes = newAttributes;
    } else /* if (originalData.tag == 'ellipse') */ {
        var newData = shallowCopyObject(originalData);
        newData.tag = 'path';
        var originalAttributes = originalData.attributes;
        var newAttributes = shallowCopyObject(originalAttributes);
        var cx = originalAttributes.cx;
        var cy = originalAttributes.cy;
        var rx = originalAttributes.rx;
        var ry = originalAttributes.ry;
        if (guideData.tag == 'polygon') {
            var bbox = guideData.bbox;
            bbox.cx = bbox.x + bbox.width / 2;
            bbox.cy = bbox.y + bbox.height / 2;
            var p = guideData.attributes.points.split(' ')[0].split(',');
            var sx = p[0];
            var sy = p[1];
            var dx = sx - bbox.cx;
            var dy = sy - bbox.cy;
            var l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            var cosA = dx / l;
            var sinA = -dy / l;
        } else { // if (guideData.tag == 'path') {
            // FIXME: add support for getting start position from path
            var cosA = 1;
            var sinA = 0;
        }
        var x1 = rx * cosA;
        var y1 = -ry * sinA;
        var x2 = rx * (-cosA);
        var y2 = -ry * (-sinA);
        var dx = x2 - x1;
        var dy = y2 - y1;
        newAttributes['d'] = 'M '  +  cx + ' ' + cy + ' m ' + x1 + ',' + y1 + ' a ' + rx + ',' + ry + ' 0 1,0 ' + dx + ',' + dy + ' a ' + rx + ',' + ry + ' 0 1,0 ' + -dx + ',' + -dy + 'z';
        delete newAttributes.cx;
        delete newAttributes.cy;
        delete newAttributes.rx;
        delete newAttributes.ry;
        newData.attributes = newAttributes;
    }
    return newData;
}

export function translatePointsAttribute(pointsString, x, y) {
    var pointStrings = pointsString.split(' ');
    var points = pointStrings.map(function(p) {return p.split(',')});
    var points = pointStrings.map(function(p) {return [roundTo2Decimals(+x + +p.split(',')[0]), roundTo2Decimals(+y + +p.split(',')[1])]});
    var pointStrings = points.map(function(p) {return p.join(',')});
    var pointsString = pointStrings.join(' ');
    return pointsString;
}

export function translateDAttribute(d, x, y) {
    var pointStrings = d.split(/[A-Z ]/);
    pointStrings.shift();
    var commands = d.split(/[^[A-Z ]+/);
    var points = pointStrings.map(function(p) {return p.split(',')});
    var points = pointStrings.map(function(p) {return [roundTo2Decimals(+x + +p.split(',')[0]), roundTo2Decimals(+y + +p.split(',')[1])]});
    var pointStrings = points.map(function(p) {return p.join(',')});
    d = commands.reduce(function(arr, v, i) {
        return arr.concat(v, pointStrings[i]);
    }, []).join('');
    return d;
}
