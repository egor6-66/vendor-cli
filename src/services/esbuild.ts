import { build, BuildOptions, context } from 'esbuild';
import path from 'path';

import { buildTypesPlugin, htmlPlugin, rebuildNotifyPlugin } from '../esbuild/plugins';
import { Config } from '../interfaces';
import { message, paths } from '../utils';

class Esbuild {
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

    async buildPlayground(playground?: Config.IPlayground) {
        const esbuildConfig = playground.config || {};
        const plugins = esbuildConfig.plugins ? esbuildConfig.plugins : [];
        plugins.push(htmlPlugin({ htmlPath: playground.htmlPath }));

        try {
            const config: BuildOptions = {
                outdir: paths.playground,
                entryNames: 'playground.[hash]',
                entryPoints: [path.resolve(playground.root)],
                platform: 'browser',
                bundle: true,
                minify: true,
                metafile: true,
                sourcemap: true,
                external: [],
                packages: 'bundle',
                ...playground.config,
                plugins,
            };

            context(config).then((res) => res.watch());
            message('success', `🎮 Playground started 🎮`);
        } catch (e) {
            message('error', e);
        }
    }

    async buildEntries(entries: Array<Config.IExposeEntry>): Promise<Array<{ name: string; path: string; watch: boolean }>> {
        try {
            return await Promise.all(
                entries.map(async (entry) => {
                    if (entry.checkTypes) {
                        entry.config.plugins.push(buildTypesPlugin);
                    }

                    entry.config.plugins.push(rebuildNotifyPlugin);

                    if (entry.watch) {
                        await context(entry.config).then((res) => res.watch());
                        message('success', `👀 Watching: ${entry.name}. 👀`);
                    } else {
                        await build(entry.config);
                    }

                    return {
                        name: entry.name,
                        path: entry.target,
                        watch: entry.watch,
                    };
                })
            );
        } catch (e) {
            message('error', e);
        }
    }
}

export default Esbuild;
