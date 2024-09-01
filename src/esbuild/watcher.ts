import Esbuild from 'esbuild';

import config from './config';

Esbuild.context(config)
    .then(async (build) => {
        await build.watch();
    })
    .catch(() => process.exit(1));
