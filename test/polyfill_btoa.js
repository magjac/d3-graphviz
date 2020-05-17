global.btoa = function(str) {
    return Buffer.from(str).toString('base64');
}

