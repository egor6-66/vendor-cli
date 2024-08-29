import fs from 'fs';
import cmd from 'node-cmd';
import path from 'path';

import { outputTsPath } from '../../constants';
import { IConfig } from '../../types';

const types = async (config: IConfig): Promise<Array<string> | null> => {
    if (!config.exposes?.entries?.length) return null;
    const { entries } = config.exposes;

    return (await Promise.all(
        entries.map((entry) => {
            return new Promise((resolve, reject) => {
                const entryFolderPath = path.join(outputTsPath, entry.name);
                console.log(entryFolderPath);
                fs.mkdirSync(entryFolderPath, { recursive: true });

                const tsConfig = {
                    compilerOptions: {
                        outDir: './',
                        declaration: true,
                        emitDeclarationOnly: true,
                        esModuleInterop: true,
                        jsx: 'preserve',
                        isolatedModules: true,
                        resolveJsonModule: true,
                        moduleResolution: 'bundler',
                        module: 'esnext',
                    },
                    include: [`../../../../${entry.target}`],
                };

                const tsconfigPath = path.join(outputTsPath, entry.name, 'tsconfig.json');

                fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2));
                cmd.run(`tsc -p ${tsconfigPath}`, async (error) => {
                    // fs.unlinkSync(tsconfigPath);
                    resolve(entry.name);
                    // await zip.archiveFolder(entryFolderPath, `${entryFolderPath}.zip`);
                    // fs.rmSync(entryFolderPath, { recursive: true, force: true });
                });
            });
        })
    )) as Array<string>;
};

export default types;
