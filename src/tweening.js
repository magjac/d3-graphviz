import {interpolate} from "d3-interpolate";

export function pathTween(points, d1) {
    return function() {
        var pointInterpolators = points.map(function(p) {
            return interpolate([p[0][0], p[0][1]], [p[1][0], p[1][1]]);
        });
        return function(t) {
            return t < 1 ? "M" + pointInterpolators.map(function(p) { return p(t); }).join("L") : d1;
        };
    };
}

export function pathTweenPoints(node, d1, precision) {
    var path0 = node;
    var path1 = path0.cloneNode();
    var n0 = path0.getTotalLength();
    var n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

    // Uniform sampling of distance based on specified precision.
    var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
    while ((i += dt) < 1) distances.push(i);
    distances.push(1);

    // Compute point-interpolators at each distance.
    var points = distances.map(function(t) {
        var p0 = path0.getPointAtLength(t * n0);
        var p1 = path1.getPointAtLength(t * n1);
        return ([[p0.x, p0.y], [p1.x, p1.y]]);
    });
    return points;
}
