import fs from 'fs';
import cmd from 'node-cmd';
import path from 'path';

import { outputPath } from '../../constants';
import { IConfig } from '../../types';

const types = (config: IConfig, next: (entryName: string, done: boolean) => void) => {
    if (!config.exposes?.entries?.length) return null;
    const { entries } = config.exposes;

    entries.forEach((entry, index) => {
        const entryFolderPath = path.join(outputPath, 'ts', entry.name);
        fs.mkdirSync(entryFolderPath, { recursive: true });

        const getPath = () => {
            const splitPath = entry.target.split('/');

            if (splitPath.pop() === 'index.ts' || splitPath.pop() === 'index.tsx') {
                return splitPath.join('/');
            }

            return entry.target;
        };

        const tsConfig = {
            compilerOptions: {
                outDir: './',
                declaration: true,
                emitDeclarationOnly: true,
            },
            include: [`../../../../${getPath()}`],
        };

        const tsconfigPath = path.join(outputPath, 'ts', entry.name, 'tsconfig.json');

        fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2));
        cmd.run(`tsc -p ${tsconfigPath}`, async () => {
            fs.unlinkSync(tsconfigPath);
            // await zip.archiveFolder(entryFolderPath, `${entryFolderPath}.zip`);
            // fs.rmSync(entryFolderPath, { recursive: true, force: true });
            next(entry.name, index === entries.length - 1);
        });
    });
};

export default types;
