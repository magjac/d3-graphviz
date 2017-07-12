export default function(keyMode) {

    if (!this._keyModes.has(keyMode)) {
        throw Error('Illegal keyMode: ' + keyMode);
    }
    this._keyMode = keyMode;

    return this;
};
