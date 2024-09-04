import { IConfig } from '../interfaces';
import { emitter, message } from '../utils';

import Esbuild from './esbuild';
import FilesCreator from './filesCreator';
import Server from './server';
import Tsc from './tsc';

class Builder {
    config!: IConfig;

    emitter!: emitter.IEmitter;

    esbuild!: Esbuild;

    tsc = new Tsc();

    constructor(config: IConfig, emitter: emitter.IEmitter) {
        this.config = config;
        this.emitter = emitter;
        this.esbuild = new Esbuild(emitter);
        message('success', '⏳ Compiling started...⏳');
        this.bootstrap();
    }

    async bootstrap() {
        const server = this.config?.expose?.server;
        const entries = this.config?.expose?.entries;

        if (entries.length) {
            try {
                await this.tsc.createTsconfig(this.config);
                await this.esbuild.buildEntries(this.config);
            } catch (e) {
                message('error', e);
            }
        }

        if (server?.enabled) {
            if (server.playground.enabled) {
                FilesCreator.playground(this.config);
                await this.esbuild.buildPlayground(this.config);
            }

            setTimeout(() => {
                new Server(this.config, this.emitter);
            }, 2000);
        }
    }
}

export default Builder;
