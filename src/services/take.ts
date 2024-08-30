import cmd from 'node-cmd';

import { IConfig, ITakeArgs } from '../types';
import { createFile, status } from '../utils';

import Server from './server';

class Take {
    args!: ITakeArgs;

    config!: IConfig;

    constructor(config: IConfig, args: ITakeArgs) {
        this.args = args;
        this.config = config;
        this.download();
    }

    download() {
        if (this.config.remote?.entries.length) {
            Server.clientServer(this.args);
        } else {
            status.error(`there are no "remote" field in the config`);
        }
    }
}

export default Take;
