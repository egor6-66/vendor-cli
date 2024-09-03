const zlib = require('zlib');
const fs = require('fs');

function compress(path, patToSave) {
    const gzip = zlib.createGzip();
    const input = fs.createReadStream(path);
    const output = fs.createWriteStream(patToSave);
    input.pipe(gzip).pipe(output);
}

export { compress };
