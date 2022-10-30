console.log("magjac 8000: add global.fetch");
const fs = require('fs');
//import promises from 'fs';
//console.log("magjac 8010: promises", promises);
console.log("magjac 8010:");

//import * as fs_promises from 'node:fs/promises';
//import * as fs_promises from 'fs/promises';
//console.log("magjac 8020: fs_promises", fs_promises);



global.fetch = function (filename) {
    console.log("magjac 8100: fetch");
    return fs.promises.open(filename, 'r').then((filehandle) => {
        return filehandle.readFile().then(data => {
            return {
                ok: true,
                arrayBuffer: () => data,
            };
        });
    });
}
