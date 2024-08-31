const Esbuild = require('esbuild');
const config = require('./config.ts');

Esbuild.context(config)
    .then(async (build) => {
        await build.watch();
    })
    .catch(() => process.exit(1));
