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

        fs.copyFileSync(path.join(this.templatesPath, constants.configName), paths.config);
        fs.cpSync(path.join(this.templatesPath, constants.workingDirName), paths.workingDir, { recursive: true, force: true });
        fs.cpSync(path.join(__dirname, '../', 'interfaces'), path.join(paths.utils, 'interfaces'), { recursive: true, force: true });

        message('success', '😎Initialization was successful😎');
    }

    playground(config: IConfig) {
        const playgroundJs = 'playground.js';
        const playgroundScriptPath = path.join(this.templatesPath, 'scripts', playgroundJs);
        const content = fs.readFileSync(playgroundScriptPath).toString();
        const wsString = `const ws = new WebSocket('ws://localhost:${config?.expose?.server?.wsPort || constants.ports.ws}/ws');\n`;
        fs.writeFileSync(path.join(paths.playground, playgroundJs), updateFile.insertTextNextToWord(content, '//ws', wsString, 'before'));
        const clientHtmlPath = path.resolve(config?.expose?.server.playground.htmlPath);
        const clientHtml = fs.readFileSync(clientHtmlPath).toString();
        const script = `<script src="./${playgroundJs}"></script>\n`;
        fs.writeFileSync(path.join(paths.playground, 'index.html'), updateFile.insertTextNextToWord(clientHtml, '</body>', script, 'before'));
    }

    public(urls: Array<{ wsUrl: string }>, publicPath = 'public') {
        const vendorFolder = path.resolve(publicPath, 'vendor');

        if (!fs.existsSync(vendorFolder)) {
            fs.mkdirSync(vendorFolder, { recursive: true });
        }

        const publicJs = 'public.js';
        const publicScriptPath = path.join(this.templatesPath, 'scripts', publicJs);
        const content = fs.readFileSync(publicScriptPath).toString();

        const wsString = urls.reduce((acc, i) => {
            acc += `'${i.wsUrl}'`;

            return acc;
        }, '');

        fs.writeFileSync(
            path.resolve(publicPath, 'vendor', 'index.js'),
            updateFile.insertTextNextToWord(content, '//urls', `\nconst urls = [${wsString}]`, 'after')
        );
        const clientHtmlPath = path.resolve(publicPath, 'index.html');
        const clientHtml = fs.readFileSync(clientHtmlPath).toString();
        const script = `<script src="./vendor/index.js"></script>\n`;
        fs.writeFileSync(clientHtmlPath, updateFile.insertTextNextToWord(clientHtml, '</body>', script, 'before'));
    }

    indexCss(publicPath = 'public') {
        fs.readdir(path.resolve(publicPath, 'vendor'), (err, files) => {
            const imports = files.reduce((acc, i) => {
                if (fs.lstatSync(path.resolve(publicPath, 'vendor', i)).isDirectory()) {
                    acc += `@import "./${i}/index.css";\n`;
                }

                return acc;
            }, '');

            fs.writeFileSync(path.resolve(publicPath, 'vendor', 'index.css'), imports);
        });
    }
}

export default new FilesCreator();
