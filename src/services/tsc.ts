import fs from 'fs';
import path from 'path';

import { Config } from '../interfaces';
import { message, paths } from '../utils';

class Tsc {
    async createTsconfig(config: Config.IConfig) {
        try {
            return await Promise.all(
                config.expose.entries.map(async (entry) => {
                    try {
                        const tsconfig = {
                            compilerOptions: {
                                outDir: './types',
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

                        if (config.expose.declarationTypes) {
                            tsconfig.include.push(`../../../${config.expose.declarationTypes}`);
                        }

                        const entryFolderPath = path.join(paths.output, entry.name);
                        const tsconfigPath = path.join(entryFolderPath, 'tsconfig.json');

                        if (!fs.existsSync(entryFolderPath)) {
                            await fs.mkdirSync(entryFolderPath);
                        }

                        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
                    } catch (e) {
                        message('error', e);
                    }
                })
            );
        } catch (e) {
            message('error', e);
        }
    }
}

export default Tsc;
