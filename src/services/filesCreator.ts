import fs from 'fs';
import path from 'path';

import { IConfig } from '../interfaces';
import { constants, message, paths } from '../utils';

class FilesCreator {
    private templatesPath = path.join(__dirname, '../', '../', 'templates');

    private tsconfigPath = path.resolve('tsconfig.json');

    configAndWorkingDirs() {
        if (fs.existsSync(paths.config)) {
            message('error', 'Config file already exists');
        }

        if (fs.existsSync(paths.workingDir)) {
            fs.rmSync(paths.workingDir, { recursive: true, force: true });
        }

        const folders = ['_utils', 'input', 'output', 'playground'];

        fs.mkdirSync(paths.workingDir);

        folders.forEach((i) => {
            fs.mkdirSync(path.join(paths.workingDir, i));
        });

        fs.copyFileSync(path.join(this.templatesPath, constants.configName), paths.config);

        message('success', '😎Initialization was successful😎');
    }

    bootstrap(cssPaths: Array<string>) {
        const imports = cssPaths.reduce((acc, i) => {
            acc += `import "../input/${i}/index.css";\n`;

            return acc;
        }, '');

        fs.writeFileSync(path.join(paths.utils, 'bootstrap.js'), imports);
    }
}

export default new FilesCreator();
