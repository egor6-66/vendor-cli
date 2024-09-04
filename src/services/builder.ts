import { Config } from '../interfaces';
import { emitter, message } from '../utils';

import Esbuild from './esbuild';
import FilesCreator from './filesCreator';
import Server from './server';
import Tsc from './tsc';

interface IArgs {
    server: boolean;
}

class Builder {
    args!: IArgs;

    config!: Config.IConfig;

    emitter!: emitter.IEmitter;

    esbuild!: Esbuild;

    tsc = new Tsc();

    constructor(args: IArgs, emitter: emitter.IEmitter) {
        this.args = args;
        this.emitter = emitter;
        this.esbuild = new Esbuild(emitter);
        message('success', '⏳ Compiling started...⏳');
        this.bootstrap();
    }

    bootstrap() {
        this.esbuild.buildClientConfig().then(async (config) => {
            this.config = config;
            const server = config?.expose?.server;
            const entries = config?.expose?.entries;

            if (entries.length) {
                await this.tsc.createTsconfig(config);
                await this.esbuild.buildEntries(config);
            }

            if (server?.enabled) {
                if (server.playground.enabled) {
                    FilesCreator.playground(config);
                    await this.esbuild.buildPlayground(config);
                }

                setTimeout(() => {
                    new Server(this.config, this.emitter);
                }, 2000);
            }
        });
    }
}

export default Builder;
