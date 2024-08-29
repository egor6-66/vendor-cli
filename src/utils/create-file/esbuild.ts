import fs from 'fs';
import path from 'path';

import { esbuildPath, outputPath, resourcesName } from '../../constants';
import { IConfig } from '../../types';
import { status } from '../../utils';

const esbuild = (config: IConfig, next: () => void) => {
    if (!config.exposes?.entries?.length) return null;

    const platform = config.platform;
    const { entries, minify = true, sourcemap } = config.exposes;
    const folders = ['js', 'ts', 'files'];

    folders.forEach((folder) => {
        const fullPath = path.join(outputPath, folder);
        fs.rm(fullPath, { recursive: true }, () => {
            fs.mkdirSync(fullPath, { recursive: true });
        });
    });

    const entryPoints = entries.reduce(
        (acc, entry, entriesIndex) => {
            const { name, target } = entry;

            if (acc.chunks.includes(name)) {
                status.error('duplicate name');
            }

            if (!fs.existsSync(path.resolve(target))) {
                status.error(`file not found ${target}`);
            }

            const start = entriesIndex === 0;
            const end = entriesIndex === entries.length - 1;
            const entryObj = `{ in: path.resolve('${target}'), out: '${name}'}`;
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
        "const Esbuild = require('esbuild');",
        "const path = require('path'); \n",
        'module.exports = Esbuild.build({',
        `\t outdir: path.resolve('${resourcesName}', 'output', 'js'),`,
        `\t entryPoints: ${entryPoints.entries},`,
        '\t bundle: true,',
        `\t platform: '${platform}',`,
        '\t treeShaking: true,',
        `\t minify: ${minify},`,
        `\t sourcemap: ${!!sourcemap},`,
        `\t tsconfig: path.resolve('tsconfig.json'),`,
        `\t jsx: 'automatic',`,
        `\t format: 'esm',`,
        `\t external: [${external}]`,
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
