import { build, BuildOptions, context } from 'esbuild';
import path from 'path';

import { buildBundlePlugin, buildTypesPlugin, htmlPlugin } from '../esbuild/plugins';
import { IConfig } from '../interfaces';
import { message, paths } from '../utils';

import { IWsServer } from './ws';

class Esbuild {
    wsServer!: IWsServer;

    defaultConfig: BuildOptions = {
        bundle: true,
        platform: 'browser',
        minify: true,
        metafile: true,
        sourcemap: true,
        packages: 'external',
        format: 'esm',
    };

    constructor(wsServer: IWsServer) {
        this.wsServer = wsServer;
    }

    async buildPlayground(config: IConfig) {
        try {
            const inputOutput = {
                outdir: paths.playground,
                entryNames: 'index',
                entryPoints: [path.resolve(config.expose.server.playground.root)],
            };

            const esbuildConfig = this.updateConfig(
                config.expose.server.playground.esbuildConfig,
                { ...config.expose.esbuildConfig, packages: 'bundle' },
                [
                    htmlPlugin((links) => {
                        this.wsServer.sendToClient('updatePlayground', links);
                    }),
                ],
                inputOutput
            );

            context(esbuildConfig).then((res) => res.watch());
            message('success', `🎮 Playground started 🎮`);
        } catch (e) {
            message('error', e);
        }
    }

    async buildEntries(config: IConfig) {
        if (!config.expose.entries) return;

        try {
            return await Promise.all(
                config.expose.entries.map(async (entry) => {
                    const inputOutput: BuildOptions = {
                        outdir: path.join(paths.output, entry.name, `v_${entry.version}`, 'bundle'),
                        entryPoints: [path.resolve(entry.target)],
                        write: false,
                    };

                    const location = `${entry.name}/v_${entry.version}`;

                    const esbuildConfig = this.updateConfig(
                        entry.esbuildConfig,
                        config.expose.esbuildConfig,
                        [
                            buildBundlePlugin(location, () => {
                                this.wsServer.sendToClient('updateEntry', {
                                    version: entry.version,
                                    name: entry.name,
                                    folder: 'bundle',
                                });
                            }),
                        ],
                        inputOutput
                    );

                    const updEntry = {
                        checkTypes: true,
                        ...entry,
                        config: esbuildConfig,
                    };

                    if (updEntry.checkTypes) {
                        updEntry.config.plugins.push(
                            buildTypesPlugin(location, () => {
                                this.wsServer.sendToClient('updateEntry', {
                                    version: entry.version,
                                    name: entry.name,
                                    folder: 'types',
                                });
                            })
                        );
                    }

                    if (updEntry.watch) {
                        await context(updEntry.config).then((res) => res.watch());
                        message('success', `👀 Watching: ${updEntry.name}. 👀`);
                    } else {
                        await build(updEntry.config);
                    }
                })
            );
        } catch (e) {
            message('error', e);
        }
    }

    updateConfig(main = {}, second = {}, plugins = [], inputOutput = {}) {
        const config: BuildOptions = { ...this.defaultConfig, ...second, ...main, ...inputOutput };
        config.plugins && plugins.push(...config.plugins);

        return { ...config, plugins };
    }
}

export default Esbuild;
