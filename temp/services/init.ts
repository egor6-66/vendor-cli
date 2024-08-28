import fs from 'fs';
import path from 'path';

import { projectName, serverType } from '../constants';
import state from '../state';
import { status } from '../utils';

const prompts = require('prompts');

class Init {
    private templatesPath = path.join(__dirname, '../', '../', '../', 'templates');

    constructor() {
        this.createConfig();
    }

    private createConfig() {
        prompts({
            type: 'select',
            name: 'webpack',
            message: 'you are using webpack?🤔',
            choices: [
                { title: '✅  yes', value: true },
                { title: '❌  no', value: false },
            ],
        }).then(({ webpack }: { webpack: boolean }) => {
            state.set({ webpack: webpack ? 'client' : 'vendor' });

            if (!webpack) {
                fs.copyFile(path.join(this.templatesPath, 'webpack.config.ts'), path.resolve('webpack1.config.ts'), () => '');
            }

            prompts({
                type: 'select',
                name: 'serverType',
                message: 'select server type',
                choices: [
                    { title: `🏭 ${serverType.DIST}`, description: 'all common data will be stored here', value: serverType.DIST },
                    { title: `‍💻${serverType.CLIENT}`, description: 'here will request data', value: serverType.CLIENT },
                ],
            }).then(({ serverType }: { serverType: serverType }) => {
                state.set({ serverType });
                fs.copyFile(path.join(this.templatesPath, `${serverType}.ts`), path.resolve(`${projectName}.config.ts`), (err) => {
                    err ? status.error('failed to create file') : status.success(' 😎Configuration file successfully created😎 ');
                });
            });
        });
    }
}

export default Init;
