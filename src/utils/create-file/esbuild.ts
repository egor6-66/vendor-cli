import fs from 'fs';
import path from 'path';

import { esbuildPath, resourcesName } from '../../constants';
import { IConfig } from '../../types';
import { status } from '../../utils';

const esbuild = (config: IConfig, next: () => void) => {
    if (!config.exposes?.entries?.length) return null;

    const platform = config.platform;
    const { entries, minify = true, sourcemap } = config.exposes;

    const entryPoints = entries.reduce(
        (acc, entry, entriesIndex) => {
            const targets = Object.entries(entry.targets);
            targets.forEach(([key, val], targetsIndex) => {
                if (acc.chunks.includes(key)) {
                    status.error('duplicate name');
                }

                if (!fs.existsSync(path.resolve(val))) {
                    status.error(`file not found ${val}`);
                }

                const start = entriesIndex === 0 && targetsIndex === 0;
                const end = entriesIndex === entries.length - 1 && targetsIndex === targets.length - 1;
                const entryObj = `{ in: path.resolve('${val}'), out: '${entry.name}'}`;
                acc.entries += `${start ? '[' : ''} \n \t\t ${entryObj}, ${end ? '\n\t]' : ''}`;
            });

            return acc;
        },
        { entries: '', chunks: [] } as { entries: string; chunks: Array<string> }
    );

    const rows = [
        "const Esbuild = require('esbuild');",
        "const path = require('path'); \n",
        'module.exports = Esbuild.build({',
        `\t outdir: path.resolve('${resourcesName}', 'scripts'),`,
        `\t entryPoints: ${entryPoints.entries},`,
        '\t bundle: true,',
        `\t platform: '${platform}',`,
        '\t treeShaking: true,',
        `\t minify: ${minify},`,
        `\t sourcemap: ${!!sourcemap},`,
        `\t tsconfig: path.resolve('tsconfig.json'),`,
        '})',
    ];

    if (fs.existsSync(esbuildPath)) {
        fs.unlinkSync(esbuildPath);
    }

    fs.open(esbuildPath, 'w', (err) => {
        if (!err) {
            rows.forEach((row) => {
                fs.appendFileSync(esbuildPath, `${row}\n`);
            });
        }
    });
    next();
};

export default esbuild;
