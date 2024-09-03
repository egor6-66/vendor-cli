import { EventEmitter } from 'events';
import path from 'path';

import { Config } from '../interfaces';
import { emitter, message, paths } from '../utils';

import Esbuild from './esbuild';
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
                await this.tsc.createTsconfig(entries);
                await this.updateEntries(config);
            }

            if (server?.enabled) {
                if (server.playground.enabled) {
                    await this.esbuild.buildPlayground(server?.playground);
                }

                setTimeout(() => {
                    new Server(this.config, this.emitter);
                }, 2000);
            }
        });
    }

    async updateEntries(config: Config.IConfig) {
        try {
            const entries = config.expose.entries.map((entry) => {
                const expConfig = config.expose.config || {};
                const entryConfig = entry.config || {};

                return {
                    checkTypes: true,
                    ...entry,
                    config: {
                        outdir: path.join(paths.output, entry.name),
                        entryNames: entry.name,
                        entryPoints: [path.resolve(entry.target)],
                        bundle: true,
                        sourcemap: true,
                        metafile: true,
                        format: 'esm',
                        plugins: [],
                        ...expConfig,
                        ...entryConfig,
                    },
                };
            });

            await this.esbuild.buildEntries(entries as Array<Config.IExposeEntry>);
        } catch (e) {
            message('error', e);
        }
    }
}

export default Builder;
