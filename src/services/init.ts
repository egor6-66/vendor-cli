import fs from 'fs';
import path from 'path';

import { projectName, serverType } from '../constants';
import { status } from '../utils';

const prompts = require('prompts');

class Init {
    private templatesPath = path.join(__dirname, '../', '../', '../', 'templates');

    constructor() {
        this.createConfig();
    }

    private createConfig() {
        (async () => {
            const res = await prompts({
                type: 'select',
                name: 'serverType',
                message: 'select server type',
                choices: [
                    { title: serverType.DIST, description: 'all common data will be stored here', value: serverType.DIST },
                    { title: serverType.CLIENT, description: 'here will request data', value: serverType.CLIENT },
                ],
            });

            console.log(this.templatesPath);
            fs.readFile(`${this.templatesPath}/${res?.serverType}.ts`, 'utf8', (err, data) => {
                if (data) {
                    fs.writeFileSync(path.resolve(`${projectName}.config.ts`), data);
                    status.success('Configuration file successfully created');
                }
            });
        })();
    }
}

export default Init;
