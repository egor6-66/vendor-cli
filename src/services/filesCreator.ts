import { Plugin } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { Config } from '../interfaces';
import { constants, message, paths } from '../utils';

class FilesCreator {
    private templatesPath = path.join(__dirname, '../', '../', 'templates');

    private esbuildPath = path.join(__dirname, '../', 'esbuild', 'watchers');

    configAndWorkingDirs() {
        if (fs.existsSync(paths.config)) {
            message('error', 'Config file already exists');
        }

        if (fs.existsSync(paths.workingDir)) {
            fs.rmSync(paths.workingDir, { recursive: true, force: true });
        }

        fs.copyFileSync(path.join(this.templatesPath, constants.configName), paths.config);
        fs.cpSync(path.join(this.templatesPath, constants.workingDirName), paths.workingDir, { recursive: true, force: true });
        fs.copyFileSync(path.join(__dirname, '../', 'interfaces', 'config.d.ts'), path.join(paths.utils, 'interfaces.ts'));

        message('success', '😎 Initialization was successful 😎');
    }
}

export default new FilesCreator();
