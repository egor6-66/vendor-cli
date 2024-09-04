import { build, BuildOptions, context } from 'esbuild';
import path from 'path';

import { buildTypesPlugin, htmlPlugin, rebuildNotifyPlugin } from '../esbuild/plugins';
import { Config } from '../interfaces';
import { emitter, message, paths } from '../utils';

class Esbuild {
    emitter!: emitter.IEmitter;

    defaultConfig: BuildOptions = {
        bundle: true,
        platform: 'browser',
        minify: true,
        metafile: true,
        sourcemap: true,
        packages: 'bundle',
        format: 'esm',
    };

    constructor(emitter: emitter.IEmitter) {
        this.emitter = emitter;
    }

    async buildClientConfig() {
        const configPath = path.join(__dirname, '..', '..');

        try {
            return build({
                outdir: configPath,
                entryNames: 'config',
                entryPoints: [path.resolve('vendor.config.ts')],
                bundle: true,
                platform: 'node',
                minify: true,
                sourcemap: false,
            }).then(() => {
                return require(path.join(configPath, 'config.js')).default as Config.IConfig;
            });
        } catch (e) {
            message('error', e);
        }
    }

    async buildPlayground(config: Config.IConfig) {
        try {
            const inputOutput = {
                outdir: paths.playground,
                entryNames: 'playground.[hash]',
                entryPoints: [path.resolve(config.expose.server.playground.root)],
            };

            const esbuildConfig = this.updateConfig(config.expose.server.playground.config, config.expose.config, [htmlPlugin(emitter)], inputOutput);
            context(esbuildConfig).then((res) => res.watch());
            message('success', `🎮 Playground started 🎮`);
        } catch (e) {
            message('error', e);
        }
    }

    async buildEntries(config: Config.IConfig) {
        if (!config.expose.entries) return;

        try {
            return await Promise.all(
                config.expose.entries.map(async (entry) => {
                    const inputOutput = {
                        outdir: path.join(paths.output, entry.name),
                        entryNames: entry.name,
                        entryPoints: [path.resolve(entry.target)],
                    };

                    const esbuildConfig = this.updateConfig(entry.config, config.expose.config, [rebuildNotifyPlugin(emitter)], inputOutput);

                    const updEntry = {
                        checkTypes: true,
                        ...entry,
                        config: esbuildConfig,
                    };

                    if (updEntry.checkTypes) {
                        updEntry.config.plugins.push(buildTypesPlugin);
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
