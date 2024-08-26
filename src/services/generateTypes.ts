import fs from 'fs';
import cmd from 'node-cmd';
import path from 'path';
import * as zip from 'zip-lib';

import { projectName } from '../constants';
import { IDistConfig } from '../types';
import { status } from '../utils';

class GenerateTypes {
    constructor(config: IDistConfig) {
        this.generate(config);
    }

    generate(config: IDistConfig) {
        const typesFolderPath = path.resolve(`.${projectName}_types`);

        if (!fs.existsSync(typesFolderPath)) {
            fs.mkdirSync(typesFolderPath, { recursive: true });
        }

        config.entries.forEach((entry) => {
            const entryFolderPath = path.join(typesFolderPath, entry.name);
            fs.mkdirSync(entryFolderPath, { recursive: true });

            const tsConfig = {
                compilerOptions: {
                    outDir: './',
                    declaration: true,
                    emitDeclarationOnly: true,
                },
                include: Object.values(entry.exposes).map((i) => `../../${i}`),
            };

            const tsconfigPath = path.join(`.${projectName}_types`, entry.name, 'tsconfig.json');
            fs.writeFileSync(path.join(entryFolderPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
            cmd.run(`tsc --project ${tsconfigPath}`, async () => {
                fs.unlinkSync(tsconfigPath);
                await zip.archiveFolder(entryFolderPath, `${entryFolderPath}.zip`);
                fs.rmSync(entryFolderPath, { recursive: true, force: true });
                status.success(`${projectName} compiled successful`.toUpperCase(), true);
            });
        });
    }
}

export default GenerateTypes;
