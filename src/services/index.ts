import fs from 'fs';

import { configPath } from '../constants';
import { IConfig } from '../types';
import { status } from '../utils';

import Build from './build';
import Init from './init';

class Commands {
    private readonly config!: IConfig;

    constructor() {
        if (fs.existsSync(configPath)) {
            this.config = require(configPath);
        }
    }

    init = {
        command: 'init',
        handler: () => {
            if (this.config) {
                status.error('Config file already exists');
            }

            new Init();
        },
    };

    build = {
        command: 'build',
        handler: (args: any) => {
            if (!this.config) {
                status.error('config file not found');
            }

            new Build(this.config, args);
        },
    };

    devServer = {
        command: 'dev-server',
        handler: () => {
            if (!this.config) {
                status.error('config file not found');
            }

            // new DevServer(this.config);
        },
    };
}

export default new Commands();
