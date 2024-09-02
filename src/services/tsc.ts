import fs from 'fs';
import path from 'path';

import { cmd, message, paths } from '../utils';

class Tsc {
    async createTsconfig(entries: Array<{ name: string; path: string; watch: boolean }>) {
        try {
            return await Promise.all(
                entries.map((entry) => {
                    return new Promise((resolve, reject) => {
                        const tsconfig = {
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
                            include: [`../../../${entry.path}`],
                        };

                        const tsconfigPath = path.join(paths.output, entry.name, 'tsconfig.json');

                        fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2), (err) => {
                            if (!err) {
                                // cmd.execSync(`tsc -p ${tsconfigPath} ${entry.watch ? '--watch' : ''}`, ({ error }) => {
                                //     if (error) {
                                //         message('error', error);
                                //         reject();
                                //     }
                                // });
                                resolve(entry);
                            } else {
                                message('error', String(err));
                                reject();
                            }
                        });
                    });
                })
            );
        } catch (e) {
            message('error', e);
        }
    }
}

export default Tsc;
