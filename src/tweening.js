import {interpolate} from "d3-interpolate";

export function pathTween(d1, precision) {
    return function() {
        var points = pathTweenPoints(this, d1, precision);
        return function(t) {
            return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
        };
    };
}

export function pathTweenPoints(node, d1, precision) {
    var path0 = node;
    var path1 = path0.cloneNode();
    if (node.getTotalLength) {
        var n0 = path0.getTotalLength();
        var n1 = (path1.setAttribute("d", d1), path1).getTotalLength();
    } else { // Test workaround until https://github.com/tmpvar/jsdom/issues/1330 is fixed
        var n0 = 100.0;
        var n1 = 50.0;
    }

    // Uniform sampling of distance based on specified precision.
    var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
    while ((i += dt) < 1) distances.push(i);
    distances.push(1);

    // Compute point-interpolators at each distance.
    var points = distances.map(function(t) {
        if (node.getPointAtLength) {
            var p0 = path0.getPointAtLength(t * n0);
            var p1 = path1.getPointAtLength(t * n1);
        } else { // Test workaround until https://github.com/tmpvar/jsdom/issues/1330 is fixed
            var p0 = {x: t * n0, y: t * n0};
            var p1 = {x: t * n1, y: t * n1};
        }
        return interpolate([p0.x, p0.y], [p1.x, p1.y]);
    });
    return points;
}
