import fs from 'fs';
import path from 'path';

import { esbuildPath, outputPath } from '../../constants';
import { IConfig } from '../../types';
import { status } from '../../utils';

const esbuild = (config: IConfig, next: () => void) => {
    if (!config.exposes?.entries?.length) return null;

    const platform = config.platform;
    const { entries, minify = true, sourcemap } = config.exposes;

    fs.rm(outputPath, { recursive: true }, () => '');

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
            const entryObj = `{ in: path.resolve('${target}'), out: '${name}/${name}'}`;
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
        "const cssModulesPlugin = require('./plugins/cssModules'); \n",
        "const path = require('path'); \n",
        'module.exports = Esbuild.build({',
        `\t outdir: path.resolve('.vendor', 'output'),`,
        `\t entryPoints: ${entryPoints.entries},`,
        '\t bundle: true,',
        `\t platform: '${platform}',`,
        '\t treeShaking: true,',
        `\t minify: ${minify},`,
        `\t sourcemap: ${!!sourcemap},`,
        `\t tsconfig: path.resolve('tsconfig.json'),`,
        `\t jsx: 'automatic',`,
        `\t format: 'esm',`,
        `\t external: [${external}],`,
        // `\t plugins: [cssModulesPlugin()]`,
        '})',
    ];

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
// module.exports = esbuild
//     .context({
//         outdir: path.resolve('.vendor', 'output', 'js'),
//         entryPoints: [{ in: path.resolve('src/components/index.ts'), out: 'components' }],
//         bundle: true,
//         platform: 'browser',
//         treeShaking: true,
//         minify: false,
//         sourcemap: true,
//         tsconfig: path.resolve('tsconfig.json'),
//         jsx: 'automatic',
//         format: 'esm',
//         external: ['@types/react-dom', 'esbuild', 'ts-node', 'typescript', 'framer-motion', 'react', 'react-dom'],
//     })
//     .then((r: any) => {
//         console.log('✨ Build succeeded.');
//
//         r.watch();
//         console.log('watching...');
//     })
//     .catch(() => process.exit(1));
// {
//     version: 1,
//         name: 'components',
//     target: 'src/components/index.ts',
//     deps: ['react'],
// },
