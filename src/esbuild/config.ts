import { BuildOptions } from 'esbuild';
import path from 'path';

import htmlPlugin from './plugins/html';

export default {
    outdir: path.resolve('.vendor', 'output'),
    entryPoints: [{ in: path.resolve('src/components/index.ts'), out: 'components/components' }],
    bundle: true,
    platform: 'browser',
    treeShaking: true,
    minify: false,
    sourcemap: true,
    tsconfig: path.resolve('tsconfig.json'),
    jsx: 'automatic',
    format: 'esm',
    metafile: true,
    plugins: [htmlPlugin],
    external: [
        '@types/react-dom',
        'esbuild',
        'esbuild-css-modules-plugin',
        'esbuild-plugin-external-global',
        'ts-node',
        'typescript',
        'esbuild-sass-plugin',
        'framer-motion',
        'postcss',
        'postcss-modules',
        'react',
        'react-dom',
        'sass',
        'sha256',
    ],
} as BuildOptions;
