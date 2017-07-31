import {shallowCopyObject} from "./utils";

export function convertToPathData(originalData, guideData) {
    if (originalData.tag == 'polygon') {
        var newData = shallowCopyObject(originalData);
        newData.tag = 'path';
        var originalAttributes = originalData.attributes;
        var newAttributes = shallowCopyObject(originalAttributes);
        if (originalAttributes.points != null) {
            newAttributes['d'] = 'M' + originalAttributes.points + 'z';
            delete newAttributes.points;
        }
        newData.attributes = newAttributes;
    } else if (originalData.tag == 'ellipse') {
        var newData = shallowCopyObject(originalData);
        newData.tag = 'path';
        var originalAttributes = originalData.attributes;
        var newAttributes = shallowCopyObject(originalAttributes);
        if (originalAttributes.cx != null) {
            var cx = originalAttributes.cx;
            var cy = originalAttributes.cy;
            var rx = originalAttributes.rx;
            var ry = originalAttributes.ry;
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
        }
        newData.attributes = newAttributes;
    } else {
        var newData = originalData;
    }
    return newData;
}
