import fs from 'fs';
import path from 'path';

import { projectName } from '../constants';
import { IClientConfig, IDistConfig } from '../types';
import { status } from '../utils';

import Build from './build';
import Init from './init';

class Commands {
    vendorConfig!: IClientConfig | IDistConfig;

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

    build = {
        command: 'build',
        handler: () => {
            if (!this.vendorConfig) {
                status.error('config file not found');
            }

            new Build(this.vendorConfig);
        },
    };
}

export default new Commands();
