import fs from 'fs';
import path from 'path';

import { Config } from '../interfaces';
import { cmd, constants, message, paths } from '../utils';

class FilesCreator {
    private templatesPath = path.join(__dirname, '../', '../', 'templates');

    configAndWorkingDirs() {
        if (fs.existsSync(paths.config)) {
            message('error', 'Config file already exists');
        }

        if (fs.existsSync(paths.workingDir)) {
            fs.rmSync(paths.workingDir, { recursive: true, force: true });
        }

        fs.copyFileSync(path.join(this.templatesPath, constants.configName), paths.config);
        fs.cpSync(path.join(this.templatesPath, constants.workingDirName), paths.workingDir, { recursive: true, force: true });
        fs.copyFileSync(path.join(__dirname, '../', 'interfaces', 'config.d.ts'), path.join(paths.utils, 'interfaces.ts'));

        message('success', '😎 Initialization was successful 😎');
    }

    async esbuildConfig(config: Config.IConfig) {
        return new Promise((resolve, reject) => {
            const platform = config.platform;
            const { entries, minify = true, sourcemap } = config.expose;

            const entryPoints = entries.reduce(
                (acc, entry, entriesIndex) => {
                    const { name, target } = entry;

                    if (acc.chunks.includes(name)) {
                        message('error', 'duplicate name');
                    }

                    if (!fs.existsSync(path.resolve(target))) {
                        message('error', `file not found ${target}`);
                    }

                    const start = entriesIndex === 0;
                    const end = entriesIndex === entries.length - 1;
                    const entryObj = `{ in: path.resolve('${target}'), out: '${name}/${name}'}`;
                    acc.chunks.push(name);
                    acc.entries += `${start ? '[' : ''} \n \t\t ${entryObj}, ${end ? '\n\t]' : ''}`;

                    return acc;
                },
                { entries: '', chunks: [] } as { entries: string; chunks: Array<string> }
            );

            const json = require(path.resolve('package.json'));

            const external = ['devDependencies', 'dependencies'].reduce((acc, i) => {
                Object.keys(json[i]).forEach((libName) => {
                    acc += `'${libName}', `;
                });

                return acc;
            }, '' as string);

            const rows = [
                "const path = require('path'); \n",
                'module.exports = {',
                `\t outdir: path.resolve('.vendor', 'output'),`,
                `\t entryPoints: ${entryPoints.entries},`,
                '\t bundle: true,',
                `\t platform: '${platform}',`,
                '\t treeShaking: true,',
                `\t minify: ${minify},`,
                `\t sourcemap: ${!!sourcemap},`,
                `\t tsconfig: path.resolve('tsconfig.json'),`,
                `\t jsx: 'automatic',`,
                `\t format: 'esm',`,
                `\t external: [${external}],`,
                '}',
            ];

            fs.open(paths.esbuildConfig, 'w', (err) => {
                if (!err) {
                    rows.forEach((row) => {
                        fs.appendFileSync(paths.esbuildConfig, `${row}\n`);
                    });
                    message('success', '🛠️Esbuild config compiled🛠️');
                    resolve('');
                } else {
                    message('error', String(err));
                    reject();
                }
            });
        });
    }

    async types(config: Config.IConfig, watch: boolean): Promise<Array<string>> {
        return (await Promise.all(
            config.expose.entries.map((entry) => {
                return new Promise((resolve, reject) => {
                    const entryFolderPath = path.join(paths.output, entry.name);

                    fs.mkdirSync(entryFolderPath, { recursive: true });

                    const tsConfig = {
                        compilerOptions: {
                            outDir: `./types`,
                            declaration: true,
                            emitDeclarationOnly: true,
                            esModuleInterop: true,
                            jsx: 'preserve',
                            isolatedModules: true,
                            resolveJsonModule: true,
                            moduleResolution: 'bundler',
                            module: 'esnext',
                        },
                        include: [`../../../${entry.target}`],
                    };

                    const tsconfigPath = path.join(paths.output, entry.name, 'tsconfig.json');

                    fs.writeFile(tsconfigPath, JSON.stringify(tsConfig, null, 2), (err) => {
                        if (!err) {
                            if (watch) {
                                cmd.separate(`tsc -p ${tsconfigPath} ${watch ? '--watch' : ''}`);
                                resolve(entry.name);
                            } else {
                                cmd.stream(`tsc -p ${tsconfigPath}`, async ({ error }) => {
                                    error ? reject() : resolve(entry.name);
                                });
                            }
                        } else {
                            message('error', String(err));
                            reject();
                        }
                    });
                });
            })
        )) as string[];
    }
}

export default new FilesCreator();
