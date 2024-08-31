import express from 'express';
import fs from 'fs';
import * as http from 'http';
import path from 'path';

import { inputPath, projectName, publicCssPath, publicPath } from '../constants';
import { IConfig } from '../types';
import { createFile, getArgs, status } from '../utils';

const config = require(path.resolve(`${projectName}.config.ts`)) as IConfig;

interface IArgs {
    port: number;
}

async function bootstrap() {
    const app = express();
    const args = getArgs() as IArgs;

    if (config.remote?.entries.length) {
        Promise.all(
            config.remote.entries.map(async (entry) => {
                const host = entry.host || config.remote?.host;
                const entryFullPath = path.join(inputPath, entry.name);

                if (!fs.existsSync(publicCssPath)) {
                    fs.mkdirSync(publicCssPath, { recursive: true });
                    const htmlPath = path.join(publicPath, 'index.html');
                    fs.readFile(htmlPath, function read(err, data) {
                        const file_content = data.toString();
                        const link = '\t<link rel="stylesheet" href="./vendor/index.css">\n';
                        const idx = file_content.indexOf('</head>') + '</head>'.length - 7;
                        const result = file_content.slice(0, idx) + link + file_content.slice(idx);
                        fs.writeFileSync(htmlPath, result);
                    });
                }

                if (!fs.existsSync(entryFullPath)) {
                    fs.mkdirSync(entryFullPath, { recursive: true });
                }

                createFile.css(config);

                if (host) {
                    await download(`${entry.name}.js`, entryFullPath, host);
                    await download(`${entry.name}.css`, publicCssPath, host);
                    status.success(`Success downloads`);
                    process.exit();
                }
            })
        ).then((res) => {
            console.log(res);
        });
    }

    // app.listen(args.port, () => {
    //     console.log('wdadawddawdwddw');
    // });
}

async function download(fileName: string, dir: string, host: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(dir, fileName));

        http.get(`${host}/${fileName.split('.')[0]}/${fileName}`, function (response) {
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
