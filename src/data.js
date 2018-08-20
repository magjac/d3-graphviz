export default function() {
    return this._data || null;
}

export function isEdgeElementParent(datum) {
    return (datum.attributes.class == 'edge' || (
        datum.tag == 'a' &&
            datum.parent.tag == 'g' &&
            datum.parent.parent.attributes.class == 'edge'
    ));
}

export function isEdgeElement(datum) {
    return datum.parent && isEdgeElementParent(datum.parent);
}

export function getEdgeGroup(datum) {
    if (datum.parent.attributes.class == 'edge') {
        return datum.parent;
    } else { // datum.parent.tag == 'g' && datum.parent.parent.tag == 'g' && datum.parent.parent.parent.attributes.class == 'edge'
        return datum.parent.parent.parent;
    }
}

export function getEdgeTitle(datum) {
    return getEdgeGroup(datum).children.find(function (e) {
        return e.tag == 'title';
    });
}
