import AdmZip from 'adm-zip';
import { build, BuildOptions, context } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { buildBundlePlugin, buildTypesPlugin, htmlPlugin } from '../esbuild/plugins';
import { IConfig } from '../interfaces';
import { constants, message, paths } from '../utils';

import Tsc from './tsc';
import { IWsServer } from './ws';

const zip = new AdmZip();

class Esbuild {
    wsServer!: IWsServer;

    tsc = new Tsc();

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
            const playground = config?.expose?.server?.playground;

            if (!playground.htmlPath) {
                return message('warning', `htmlPath not found!`);
            }

            if (!fs.existsSync(path.resolve(playground.root))) {
                return message('warning', `root ${playground.root} not found!`);
            }

            const inputOutput = {
                outdir: paths.playground,
                entryNames: 'index.[hash]',
                entryPoints: [path.resolve(playground.root)],
            };

            const esbuildConfig = this.updateConfig(
                config.expose.server.playground.esbuildConfig,
                { ...config.expose.esbuildConfig, packages: 'bundle' },
                [htmlPlugin(playground.htmlPath)],
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
            return await Promise.allSettled(
                config.expose.entries.map(async (entry) => {
                    if (!fs.existsSync(path.resolve(entry.target))) {
                        return message('warning', `${entry.target} not found!`);
                    }

                    const location = `${entry.name}/v_${entry.version}`;

                    if (entry.original) {
                        const bundlePath = path.join(paths.output, location, 'bundle.zip');
                        const content = fs.readFileSync(path.resolve(entry.target));
                        await zip.addFile(entry.target.split('/').pop(), content);

                        return zip.writeZip(bundlePath);
                    }

                    const inputOutput: BuildOptions = {
                        outdir: path.join(paths.output, entry.name, `v_${entry.version}`, 'bundle'),
                        entryPoints: [path.resolve(entry.target)],
                        write: false,
                    };

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
                        watch: true,
                        ...entry,
                        config: esbuildConfig,
                    };

                    const ext = entry.target.split('/').pop().split('.').pop();

                    if (updEntry.checkTypes && ['tsx', 'ts'].includes(ext)) {
                        await this.tsc.createTsconfig(entry, config.expose?.declarationTypes);
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
