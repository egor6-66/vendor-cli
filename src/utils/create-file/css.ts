import fs from 'fs';
import path from 'path';

import { projectName, publicCssPath } from '../../constants';
import { IConfig } from '../../types';

function css(config: IConfig) {
    if (!config.remote?.entries.length) return;

    const rows = config.remote?.entries.reduce((acc, entry) => {
        acc += `@import "./${entry.name}.css"; \n`;

        return acc;
    }, '');

    const fullPath = path.join(publicCssPath, 'index.css');
    fs.open(fullPath, 'w', (err) => {
        if (!err) {
            fs.appendFileSync(fullPath, rows as string);
        }
    });
}

export default css;
