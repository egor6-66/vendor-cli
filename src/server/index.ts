import express from 'express';
import fs from 'fs';
import path from 'path';

import { projectName } from '../constants';
import { status } from '../utils';

// const configPath = path.resolve(`${projectName}.config.ts`);
const app = express();

async function bootstrap() {
    // if (!fs.existsSync(configPath)) return status.error('config not found');

    app.get(`/types/:name`, (req, res) => {
        console.log('wdad');
        // res.sendFile(path.resolve(path.join(`.${projectName}`, 'types', req.params.name)));
    });

    app.listen(9000);
}

bootstrap();
