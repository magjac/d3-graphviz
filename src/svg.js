import {shallowCopyObject} from "./utils";

export function convertToPathData(originalData) {
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
            // FIXME: TODO compute automatically when original tag is restored after transition
            // Start the ellipse at 30 deg to be close to rectangle start point
            var angle = Math.PI / 6;
            var x1 = rx * Math.cos(angle);
            var y1 = -ry * Math.sin(angle);
            var x2 = rx * Math.cos(angle + Math.PI);
            var y2 = -ry * Math.sin(angle + Math.PI);
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
