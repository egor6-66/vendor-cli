import { IConfig } from '../interfaces';
import { constants, message } from '../utils';

import Esbuild from './esbuild';
import FilesCreator from './filesCreator';
import Server from './server';
import Tsc from './tsc';
import Ws, { IWsServer } from './ws';

class Builder {
    config!: IConfig;

    esbuild!: Esbuild;

    wsServer!: IWsServer;

    tsc = new Tsc();

    constructor(config: IConfig) {
        this.config = config;

        if (config.expose.server.enabled) {
            const wsPort = this.config?.expose?.server.wsPort || constants.ports.ws;
            this.wsServer = Ws.createServer(wsPort);
        }

        this.esbuild = new Esbuild(this.wsServer);
        this.bootstrap();
        message('success', '⏳ Compiling started...⏳');
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
                new Server(this.config);
            }, 2000);
        }
    }
}

export default Builder;
