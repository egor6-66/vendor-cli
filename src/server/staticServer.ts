import express from 'express';
import path from 'path';

import { outputPath } from '../constants';
import { getArgs } from '../utils';

interface IArgs {
    port: number;
}
// const configPath = path.resolve(`${projectName}.config.ts`);

async function bootstrap() {
    const app = express();
    const args = getArgs() as IArgs;
    // if (!fs.existsSync(configPath)) return status.error('config not found');
    // console.log(+args.port);

    app.get(`/resources/:name`, (req, res) => {
        const file = req.params.name;
        const folder = file.split('.')[0];
        res.sendFile(path.join(outputPath, folder, file));
    });

    app.listen(args.port);
}

bootstrap();
