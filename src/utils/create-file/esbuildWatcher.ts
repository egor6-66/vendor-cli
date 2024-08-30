import fs from 'fs';

import { esbuildWatcherPath } from '../../constants';

const esbuildWatcher = () => {
    const rows = [
        "const Esbuild = require('esbuild');",
        "const config = require('./config.ts');\n",
        'Esbuild.context(config).then(async (build) => {await build.watch()}).catch(() => process.exit(1)) ',
    ];

    fs.open(esbuildWatcherPath, 'w', (err) => {
        if (!err) {
            rows.forEach((row) => {
                fs.appendFileSync(esbuildWatcherPath, `${row}\n`);
            });
        }
    });
};

export default esbuildWatcher;
