export default function(callback) {

    this._onerror = callback

    return this;
};
