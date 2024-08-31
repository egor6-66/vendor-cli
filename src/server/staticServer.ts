import express from 'express';
import path from 'path';

import { outputPath, projectName } from '../constants';
import { IConfig } from '../types';
import { getArgs } from '../utils';

const config = require(path.resolve(`${projectName}.config.ts`)) as IConfig;
interface IArgs {
    port: number;
}
// const configPath = path.resolve(`${projectName}.config.ts`);

async function bootstrap() {
    const app = express();
    const args = getArgs() as IArgs;

    // if (!fs.existsSync(configPath)) return status.error('config not found');
    // console.log(+args.port);
    if (config.expose?.entries.length) {
        config.expose?.entries.forEach((entry) => {
            app.get(`/${entry.name}/:name`, (req, res) => {
                const file = req.params.name;
                const folder = file.split('.')[0];
                res.sendFile(path.join(outputPath, folder, file));
            });
        });
    }

    app.listen(args.port);
}

bootstrap();
