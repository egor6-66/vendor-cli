import fs from 'fs';
import cmd from 'node-cmd';
import path from 'path';

import { configName, resourcesName, resourcesPath } from '../constants';
import { status } from '../utils';

class Init {
    private templatesPath = path.join(__dirname, '../', '../', 'templates');

    constructor() {
        this.createConfig();
    }

    private createConfig() {
        fs.copyFile(path.join(this.templatesPath, configName), path.resolve(configName), (err) => {
            if (err) {
                status.error('failed to create configuration file');
            } else {
                this.installEsbuild(this.createVendorFolder.bind(this));
            }
        });
    }

    installEsbuild(next: () => void) {
        cmd.run(`esbuild --version`, (err) => {
            if (err) {
                cmd.run(`npm i -D esbuild`, (err) => {
                    !err && next();
                });
            } else {
                next();
            }
        });
    }

    createVendorFolder() {
        if (fs.existsSync(resourcesPath)) {
            fs.rmSync(resourcesPath, { recursive: true, force: true });
        }

        fs.cpSync(path.join(this.templatesPath, resourcesName), resourcesPath, { recursive: true });
        status.success('😎 Initialization was successful 😎 ');
    }
}

export default Init;
