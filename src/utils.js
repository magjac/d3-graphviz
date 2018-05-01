export function shallowCopyObject(obj) {
    return Object.assign({}, obj);
}

export function roundTo4Decimals(x) {
    return Math.round(x * 10000.0) / 10000.0
}
