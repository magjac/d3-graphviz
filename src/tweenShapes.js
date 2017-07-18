export default function(enable) {

    this._tweenShapes = enable;
    if (enable) {
        this._tweenPaths = true;
    }

    return this;
};
