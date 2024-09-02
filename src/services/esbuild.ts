import { build, context } from 'esbuild';
import path from 'path';

import vendorPlugins from '../esbuild/plugins';
import { Config } from '../interfaces';
import { getSize, message } from '../utils';

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

    async build(entries: Array<Config.IExposeEntry>): Promise<Array<{ name: string; path: string; watch: boolean }>> {
        try {
            return await Promise.all(
                entries.map(async (entry) => {
                    const userPlugins = entry.config?.plugins;
                    const plugins = userPlugins?.length ? [...userPlugins, ...vendorPlugins] : vendorPlugins;

                    if (entry.watch) {
                        context({ ...entry.config, plugins }).then((res) => res.watch());
                    } else {
                        const res = await build({
                            ...entry.config,
                            // plugins: plugins,
                        });

                        Object.entries(res.metafile.outputs).forEach(([key, val]) => {
                            if (key.match(/.(js|css)/)) {
                                message('info', `size ${entry.name}.${key.split('.').pop()} => ${getSize.bytesToSize(val.bytes)}`);
                            }
                        });
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
