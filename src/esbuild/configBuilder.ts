import Esbuild from 'esbuild';
import path from 'path';

Esbuild.build({
    outdir: path.join(__dirname),
    entryPoints: [path.resolve('vendor.config.ts')],
    bundle: true,
    platform: 'node',
    minify: false,
});
