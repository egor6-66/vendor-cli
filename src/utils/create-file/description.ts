import fs from 'fs';
import path from 'path';

import { descriptionPath, esbuildPath, resourcesName } from '../../constants';
import { IConfig } from '../../types';
import { status } from '../../utils';

const description = (config: IConfig) => {
    if (!config.exposes?.entries?.length) return null;

    const rows = ["const Esbuild = require('esbuild');", "const path = require('path'); \n"];

    fs.open(descriptionPath, 'w', (err) => {
        if (!err) {
            rows.forEach((row) => {
                fs.appendFileSync(descriptionPath, `${row}\n`);
            });
        }
    });
};

export default description;
