import fs from 'fs';
import cmd from 'node-cmd';
import path from 'path';

import { typesPath } from '../../constants';
import { IConfig } from '../../types';

const types = (config: IConfig, next: (entryName: string, done: boolean) => void) => {
    if (!config.exposes?.entries?.length) return null;
    const { entries } = config.exposes;

    entries.forEach((entry, index) => {
        const entryFolderPath = path.join(typesPath, entry.name);
        fs.mkdirSync(entryFolderPath, { recursive: true });

        const tsConfig = {
            compilerOptions: {
                outDir: './',
                declaration: true,
                emitDeclarationOnly: true,
            },
            include: Object.values(entry.targets).map((i) => `../../../${i}`),
        };

        const tsconfigPath = path.join(typesPath, entry.name, 'tsconfig.json');
        fs.writeFileSync(path.join(entryFolderPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
        cmd.run(`tsc --project ${tsconfigPath}`, async () => {
            fs.unlinkSync(tsconfigPath);
            // await zip.archiveFolder(entryFolderPath, `${entryFolderPath}.zip`);
            // fs.rmSync(entryFolderPath, { recursive: true, force: true });
            next(entry.name, index === entries.length - 1);
        });
    });
};

export default types;
