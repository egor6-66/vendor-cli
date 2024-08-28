const Esbuild = require('esbuild');
const path = require('path');
console.log(path.join('src', 'test', 'index.ts'));
Esbuild.build({
    outdir: path.resolve('build'),
    entryNames: 'test-nomin',
    entryPoints: [path.resolve(__dirname, 'src', 'test', 'index.ts')],
    bundle: true,
    platform: 'node',
    treeShaking: true,
    // minify: true,
});
