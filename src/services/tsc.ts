import fs from 'fs';
import path from 'path';

import { IConfig } from '../interfaces';
import { message, paths } from '../utils';

class Tsc {
    async createTsconfig(config: IConfig) {
        try {
            return await Promise.all(
                config.expose.entries.map(async (entry) => {
                    const root = '../../../../';
                    const entryFolderPath = path.join(paths.output, entry.name, `v_${entry.version}`);
                    const tsconfigPath = path.join(entryFolderPath, 'tsconfig.json');

                    if (!fs.existsSync(entryFolderPath)) {
                        fs.mkdirSync(entryFolderPath, { recursive: true });
                    }

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
                            include: [`${root}${entry.target}`],
                        };

                        if (config?.expose?.declarationTypes?.length) {
                            tsconfig.include.push(...config.expose.declarationTypes.map((i) => `${root}${i}`));
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
