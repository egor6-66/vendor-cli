import fs from 'fs';

import { configPath } from '../constants';
import { IConfig } from '../types';
import { status } from '../utils';

import Build from './build';
import Init from './init';
import Take from './take';

class Commands {
    private readonly config!: IConfig;

    constructor() {
        if (fs.existsSync(configPath)) {
            this.config = require(configPath);
        }
    }

    checkConfig() {
        if (!this.config) {
            status.error('config file not found');
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
            this.checkConfig();
            new Build(this.config, args);
        },
    };

    take = {
        command: 'take',
        handler: (args: any) => {
            this.checkConfig();
            new Take(this.config, args);
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
