export function rotate(x, y, cosA, sinA) {
    // (x + j * y) * (cosA + j * sinA) = x * cosA - y * sinA + j * (x * sinA + y * cosA)
    y = -y;
    sinA = -sinA;
    [x, y] = [x * cosA - y * sinA, x * sinA + y * cosA];
    y = -y;
    return [x, y];
}
