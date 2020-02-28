export function shallowCopyObject(obj) {
    return Object.assign({}, obj);
}

export function roundTo2Decimals(x) {
    return Math.round(x * 100.0) / 100.0
}
