import { build, BuildOptions, context } from 'esbuild';
import path from 'path';

import { buildTypesPlugin, htmlPlugin, rebuildNotifyPlugin } from '../esbuild/plugins';
import { Config } from '../interfaces';
import { emitter, message, paths } from '../utils';

class Esbuild {
    emitter!: emitter.IEmitter;

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
        const expConfig = config.expose.config || {};
        const playgroundConfig = config.expose.server.playground.config || {};

        const clientEsbuildConfig: any = { ...expConfig, ...playgroundConfig };

        const plugins = clientEsbuildConfig?.plugins ? [...clientEsbuildConfig.plugins] : [];

        plugins.push(htmlPlugin(emitter));

        try {
            const esbuildConfig: BuildOptions = {
                outdir: paths.playground,
                entryNames: 'playground.[hash]',
                entryPoints: [path.resolve(config.expose.server.playground.root)],
                platform: 'browser',
                bundle: true,
                minify: true,
                metafile: true,
                sourcemap: true,
                packages: 'bundle',
                format: 'esm',
                ...expConfig,
                ...playgroundConfig,
                plugins,
            };

            context(esbuildConfig).then((res) => res.watch());
            message('success', `🎮 Playground started 🎮`);
        } catch (e) {
            message('error', e);
        }
    }

    async buildEntries(config: Config.IConfig): Promise<Array<{ name: string; path: string; watch: boolean }>> {
        if (!config.expose.entries) return;

        try {
            return await Promise.all(
                config.expose.entries.map(async (entry) => {
                    const expConfig = config.expose.config || {};
                    const entryConfig = entry.config || {};
                    const clientEsbuildConfig: any = { ...expConfig, ...entryConfig };

                    const plugins = clientEsbuildConfig?.plugins ? [...clientEsbuildConfig.plugins] : [];

                    const updEntry = {
                        checkTypes: true,
                        ...entry,
                        config: {
                            outdir: path.join(paths.output, entry.name),
                            entryNames: entry.name,
                            entryPoints: [path.resolve(entry.target)],
                            bundle: true,
                            minify: true,
                            sourcemap: true,
                            metafile: true,
                            format: 'esm',
                            ...expConfig,
                            ...entryConfig,
                            plugins,
                        },
                    };

                    if (updEntry.checkTypes) {
                        updEntry.config.plugins.push(buildTypesPlugin);
                    }

                    updEntry.config.plugins.push(rebuildNotifyPlugin(emitter));

                    if (updEntry.watch) {
                        await context({ ...updEntry.config, plugins } as BuildOptions).then((res) => res.watch());
                        message('success', `👀 Watching: ${updEntry.name}. 👀`);
                    } else {
                        await build({ ...updEntry.config, plugins } as BuildOptions);
                    }

                    return {
                        name: updEntry.name,
                        path: updEntry.target,
                        watch: updEntry.watch,
                    };
                })
            );
        } catch (e) {
            message('error', e);
        }
    }
}

export default Esbuild;
