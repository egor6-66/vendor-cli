import fs from 'fs';
import path from 'path';

const crypto = require('crypto');

const archiver = require('archiver');
archiver.registerFormat('zip-encrypted', require('archiver-zip-encrypted'));

interface ICompressProps {
    out: string;
    lvl: number;
    pass: string;
}
const algorithm = 'aes-256-ctr';

const encrypt = (text, pass) => {
    const openKey = crypto.randomBytes(16);
    const salt = pass;
    const hash = crypto.createHash('sha1');

    hash.update(salt);

    const key = hash.digest().slice(0, 16);

    const cipher = crypto.createCipheriv('aes-128-cbc', key, openKey);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        content: encrypted.toString('hex'),
        openKey,
    };
};

const decrypt = (hash, pass) => {
    const decipher = crypto.createDecipheriv(algorithm, pass, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

function compress(props: ICompressProps) {
    const { out, lvl, pass } = props;

    if (!fs.existsSync(out)) {
        fs.mkdirSync(out, { recursive: true });
    }

    const stream = fs.createWriteStream(path.join(out, 'bundle.zip'));

    const archive = archiver('zip', {
        zlib: { level: lvl },
    });

    archive.pipe(stream);

    const append = {
        async buffer(buffer: Buffer, name: string) {
            if (pass) {
                const { openKey, content } = encrypt(buffer, pass);
                await archive.append(content, { name: name });
                await archive.append(openKey, { name: `${name}.openKey.txt` });
            } else {
                await archive.append(buffer, { name: name });
            }
        },
        async directory(pathToDir: string) {
            const files = fs.readdirSync(pathToDir);

            return await Promise.all(
                files.map(async (file) => {
                    return this.buffer(fs.readFileSync(path.join(pathToDir, file)), file);
                })
            );
        },
    };

    return { append, archive };
}

export { compress };
