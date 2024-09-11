import archiver from 'archiver';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

import message from './message';

interface ICompressProps {
    pathToDir: string;
    fileName: string;
    lvl: number;
    pass: string;
}
const algorithm = 'aes-256-ctr';
const openKey = Buffer.from('0000000000000000');

const updPass = (pass) => {
    const updPass = pass + 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3awdawdawdwaddw';

    return updPass.slice(0, 32);
};

function compress(props: ICompressProps) {
    const { pathToDir, fileName, lvl, pass } = props;

    if (!fs.existsSync(pathToDir)) {
        fs.mkdirSync(pathToDir, { recursive: true });
    }

    const fullPath = path.join(pathToDir, pass ? `init_${fileName}` : fileName);
    const stream = fs.createWriteStream(fullPath);
    const archive = archiver('zip', { zlib: { level: lvl } });

    archive.pipe(stream);

    const append = {
        async buffer(buffer: Buffer, name: string) {
            await archive.append(buffer, { name: name });
        },
        async directory(pathToDir: string) {
            archive.directory(pathToDir, false);
        },
    };

    if (pass) {
        stream.on('close', () => {
            const enc = crypto.createCipheriv(algorithm, updPass(pass), openKey);
            const readStream = fs.createReadStream(fullPath);
            const writeStream = fs.createWriteStream(path.join(pathToDir, fileName));
            readStream
                .pipe(enc)
                .pipe(writeStream)
                .on('close', () => {
                    fs.unlinkSync(fullPath);
                });
        });
    }

    return { append, archive, stream };
}

async function unzip(buffer: ArrayBuffer, output: string, pass = '', entryName) {
    const getDir = async () => {
        try {
            const decrypt = (content, pass) => {
                const decipher = crypto.createDecipheriv(algorithm, updPass(pass), Buffer.from(openKey.toString('hex'), 'hex'));

                return Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
            };

            return await unzipper.Open.buffer(pass ? decrypt(buffer, pass) : Buffer.from(buffer));
        } catch (e) {
            if (pass) {
                message('warning', `${entryName} Incorrect archive password or archive not found`);
            }
        }
    };

    const directory = await getDir();

    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
    }

    await directory.extract({ path: output });

    return directory.files;
}

export { compress, unzip };
