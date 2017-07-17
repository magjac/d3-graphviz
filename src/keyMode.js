export default function(keyMode) {

    if (!this._keyModes.has(keyMode)) {
        throw Error('Illegal keyMode: ' + keyMode);
    }
    if (keyMode != this._keyMode && this._data != null) {
        throw Error('Too late to change keyMode');
    }
    this._keyMode = keyMode;

    return this;
};
