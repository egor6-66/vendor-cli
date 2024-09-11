import fs from 'fs';
import path from 'path';

import { IConfig } from '../interfaces';
import { constants, message, paths, updateFile } from '../utils';

class FilesCreator {
    private templatesPath = path.join(__dirname, '../', '../', 'templates');

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

    playground(config: IConfig) {
        const wsPort = config.expose?.server?.wsPort || constants.ports.ws;
        const htmlPath = config?.expose?.server?.playground?.htmlPath;
        if (!htmlPath) return;
        const data = fs.readFileSync(path.resolve(htmlPath), 'utf8');
        const script = '<script src="./playground.js"></script>';
        fs.writeFileSync(path.join(paths.playground, 'index.html'), updateFile.insertTextNextToWord(data, '</body>', script, 'before'));
        const playgroundData = fs.readFileSync(path.join(this.templatesPath, 'playground.js'), 'utf8');
        const socketScript = `\nconst ws = new WebSocket('ws://localhost:${wsPort}/ws');\n`;
        fs.writeFileSync(path.join(paths.playground, 'playground.js'), updateFile.insertTextNextToWord(playgroundData, '//socket', socketScript, 'after'));
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
