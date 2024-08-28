import express from 'express';
import fs from 'fs';
import path from 'path';

import { projectName } from '../constants';
import state from '../state';
import { IClientConfig, IDistConfig } from '../types';
import { status } from '../utils';

import distributor from './distributor';

const configPath = path.resolve(`${projectName}.config.ts`);
const app = express();

async function bootstrap() {
    if (!fs.existsSync(configPath)) return status.error('config not found');

    const config: IDistConfig | IClientConfig = require(configPath);

    if (state.get('serverType') === 'distributor') {
        distributor(app, config as IDistConfig);
    }

    app.listen(config.serverPort);
}

bootstrap();
