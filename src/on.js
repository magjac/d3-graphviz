export default function(typenames, callback) {

    this._dispatch.on(typenames, callback);

    return this;
};
