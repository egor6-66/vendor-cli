import { build, BuildOptions, context } from 'esbuild';
import path from 'path';

import { buildTypesPlugin, htmlPlugin, rebuildNotifyPlugin } from '../esbuild/plugins';
import { IConfig } from '../interfaces';
import { emitter, message, paths } from '../utils';

class Esbuild {
    emitter!: emitter.IEmitter;

    defaultConfig: BuildOptions = {
        bundle: true,
        platform: 'browser',
        minify: true,
        metafile: true,
        sourcemap: true,
        packages: 'external',
        format: 'esm',
    };

    constructor(emitter: emitter.IEmitter) {
        this.emitter = emitter;
    }

    async buildPlayground(config: IConfig) {
        try {
            const inputOutput = {
                outdir: paths.playground,
                entryNames: '[name]-[hash]',
                entryPoints: [path.resolve(config.expose.server.playground.root)],
            };

            const esbuildConfig = this.updateConfig(
                config.expose.server.playground.esbuildConfig,
                config.expose.esbuildConfig,
                [htmlPlugin(emitter)],
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
                    const inputOutput = {
                        outdir: path.join(paths.output, entry.name, `v_${entry.version}`),
                        entryPoints: [path.resolve(entry.target)],
                    };

                    const location = `${entry.name}/v_${entry.version}`;

                    const esbuildConfig = this.updateConfig(
                        entry.esbuildConfig,
                        config.expose.esbuildConfig,
                        [rebuildNotifyPlugin(emitter, location)],
                        inputOutput
                    );

                    const updEntry = {
                        checkTypes: true,
                        ...entry,
                        config: esbuildConfig,
                    };

                    if (updEntry.checkTypes) {
                        updEntry.config.plugins.push(buildTypesPlugin(location));
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
