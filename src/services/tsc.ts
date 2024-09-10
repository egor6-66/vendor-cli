import fs from 'fs';
import path from 'path';

import { IEntry } from '../interfaces/expose';
import { message, paths } from '../utils';

class Tsc {
    async createTsconfig(entry: IEntry, declarationTypes?: Array<string>) {
        try {
            const root = '../../../../';
            const entryFolderPath = path.join(paths.output, entry.name, `v_${entry.version}`);
            const tsconfigPath = path.join(entryFolderPath, 'tsconfig.json');

            if (!fs.existsSync(entryFolderPath)) {
                fs.mkdirSync(entryFolderPath, { recursive: true });
            }

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

            if (declarationTypes?.length) {
                tsconfig.include.push(...declarationTypes.map((i) => `${root}${i}`));
            }

            await fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        } catch (e) {
            message('error', e);
        }
    }
}

export default Tsc;
