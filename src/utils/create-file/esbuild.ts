import fs from 'fs';

import { esbuildPath } from '../../constants';
import { IConfig } from '../../types';

const esbuild = (config: IConfig, next: () => void) => {
    const rows = ["const Esbuild = require('esbuild');", "const config = require('./config.ts');\n", `Esbuild.build(config);`];

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
