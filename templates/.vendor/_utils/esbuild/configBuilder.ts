const path = require('path');
const Esbuild = require('esbuild');

Esbuild.build({
    outdir: path.resolve('.vendor', '_utils'),
    entryPoints: [path.resolve('vendor.config.ts')],
    bundle: true,
    platform: 'node',
    minify: false,
});
