import express from 'express';
import fs from 'fs';
import * as http from 'http';
import path from 'path';

import { inputPath, projectName } from '../constants';
import { IConfig } from '../types';
import { getArgs, status } from '../utils';

const config = require(path.resolve(`${projectName}.config.ts`)) as IConfig;

interface IArgs {
    port: number;
}

async function bootstrap() {
    const app = express();
    const args = getArgs() as IArgs;
    console.log('wdawdwd', config);

    if (config.remote?.entries.length) {
        Promise.all(
            config.remote.entries.map(async (entry) => {
                const host = entry.host || config.remote?.host;
                const fullPath = path.join(inputPath, entry.name);

                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }

                if (host) {
                    await download(`${entry.name}.js`, host);
                    status.success(`Success downloads`);
                    process.exit();
                }
            })
        ).then((res) => {
            console.log(res);
        });
    }

    app.listen(args.port, () => {
        console.log('wdadawddawdwddw');
    });
}

async function download(fileName: string, host: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(inputPath, fileName.split('.')[0], fileName));

        http.get(`${host}/resources/${fileName}`, function (response) {
            response.pipe(file);

            // after download completed close filestream
            file.on('finish', (err: string) => {
                file.close();
                err ? reject(err) : resolve(file);
            });
        });
    });
}

bootstrap();
