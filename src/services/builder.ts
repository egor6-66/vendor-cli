import path from 'path';

import { Config } from '../interfaces';
import { message, paths } from '../utils';

import Esbuild from './esbuild';
import Server from './server';
import Tsc from './tsc';

interface IArgs {
    server: boolean;
}

class Builder {
    args!: IArgs;

    config!: Config.IConfig;

    esbuild = new Esbuild();

    tsc = new Tsc();

    constructor(args: IArgs) {
        this.args = args;
        message('success', '⏳ Compiling started...⏳');
        this.bootstrap();
    }

    bootstrap() {
        this.esbuild.buildClientConfig().then(async (config) => {
            this.config = config;
            const playground = this.config?.expose?.server?.playground;

            if (config?.expose?.entries.length) {
                await this.updateEntries(config);
            }

            if (playground) {
                await this.esbuild.buildPlayground(playground);
            }

            if (!this.config?.expose?.server?.disabled) {
                setTimeout(() => {
                    new Server(this.config);
                }, 2000);
            }
        });
    }

    async updateEntries(config: Config.IConfig) {
        try {
            const entries = config.expose.entries.map((entry) => {
                const esbuildConfig = config.expose.config || entry.config;

                return {
                    ...entry,
                    config: {
                        ...esbuildConfig,
                        outdir: path.join(paths.output, entry.name),
                        entryNames: entry.name,
                        entryPoints: [path.resolve(entry.target)],
                        bundle: true,
                        metafile: true,
                        format: 'esm',
                    },
                };
            });

            await this.buildEntries(entries as Array<Config.IExposeEntry>);
        } catch (e) {
            message('error', e);
        }
    }

    async buildEntries(entries: Array<Config.IExposeEntry>) {
        const res = await this.esbuild.buildEntries(entries);

        return await this.tsc.createTsconfig(res);
    }
}

export default Builder;
