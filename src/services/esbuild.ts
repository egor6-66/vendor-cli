import { build, BuildOptions, context } from 'esbuild';
import path from 'path';

import vendorPlugins from '../esbuild/plugins';
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
        try {
            const config: BuildOptions = {
                platform: 'browser',
                bundle: true,
                minify: true,
                sourcemap: true,
                entryNames: 'index',
                entryPoints: [path.resolve(playground.root)],
                outdir: paths.playground,
                external: [],
                packages: 'bundle',
                ...playground.config,
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
                    const userPlugins = entry.config?.plugins;
                    const plugins = userPlugins?.length ? [...userPlugins, ...vendorPlugins] : vendorPlugins;

                    if (entry.watch) {
                        context({ ...entry.config, plugins }).then((res) => res.watch());
                        message('success', `👀 Watching: ${entry.name}. 👀`);
                    } else {
                        await build({ ...entry.config, plugins });
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
