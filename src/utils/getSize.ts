import fs from 'fs';

const { join } = require('path');

const file = (filePath: string) => {
    if (fs.existsSync(filePath)) {
        return bytesToSize(fs.statSync(filePath).size);
    }
};

const dir = async (dirPath: string, end = true): Promise<string> => {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

    const paths = files.map(async (file) => {
        const path = join(dirPath, file.name);

        if (file.isDirectory()) return await dir(path, false);

        if (file.isFile()) {
            const { size } = await fs.promises.stat(path);

            return size;
        }

        return 0;
    });

    const bytes: string | number = (await Promise.all(paths)).flat(Infinity).reduce((i, size) => +i + +size, 0);

    return (end ? bytesToSize(+bytes) : String(bytes)) as string;
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

export { bytesToSize, dir, file };
