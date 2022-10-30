const fs = require('fs');

global.fetch = function (filename) {
    return fs.promises.open(filename, 'r').then((filehandle) => {
        return filehandle.readFile().then(data => {
            return {
                ok: true,
                arrayBuffer: () => data,
            };
        });
    });
}
