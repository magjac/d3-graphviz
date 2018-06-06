export default function(enable) {

    this._options.tweenShapes = enable;
    if (enable) {
        this._options.tweenPaths = true;
    }

    return this;
};
