import fs from 'fs';
import path from 'path';

import { projectName } from '../constants';
import { IClientConfig, IDistConfig } from '../types';
import { status } from '../utils';

import Init from './init';
import Run from './run';
import Stop from './stop';

class Commands {
    private readonly vendorConfig!: IClientConfig | IDistConfig;

    constructor() {
        const configPath = path.resolve(`${projectName}.config.ts`);

        if (fs.existsSync(configPath)) {
            this.vendorConfig = require(configPath);
        }
    }

    init = {
        command: 'init',
        handler: () => {
            if (this.vendorConfig) {
                status.error('Config file already exists');
            }

            new Init();
        },
    };

    run = {
        command: 'run',
        handler: () => {
            if (!this.vendorConfig) {
                status.error('config file not found');
            }

            new Run(this.vendorConfig);
        },
    };

    stop = {
        command: 'stop',
        handler: () => {
            new Stop();
        },
    };
}

export default new Commands();
