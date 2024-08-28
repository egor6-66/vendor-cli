import fs from 'fs';

const path = require('path');

const file = (filePath: string) => {
    if (fs.existsSync(filePath)) {
        return bytesToSize(fs.statSync(filePath).size);
    }
};

const dir = async (directoryPath: string) => {
    const files = await fs.promises.readdir(directoryPath);
    const stats = files.map((file) => fs.promises.stat(path.join(directoryPath, file)));

    return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + bytesToSize(size), '');
};

function bytesToSize(bytes: number) {
    if (!Number(bytes)) {
        return '0 Bytes';
    }

    const kbToBytes = 1024;

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const index = Math.floor(Math.log(bytes) / Math.log(kbToBytes));

    return `${parseFloat((bytes / Math.pow(kbToBytes, index)).toFixed(0))} ${sizes[index]}`;
}

export { dir, file };
