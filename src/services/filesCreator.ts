import fs from 'fs';
import path from 'path';

import { IConfig } from '../interfaces';
import { constants, message, paths, updateFile } from '../utils';

class FilesCreator {
    private templatesPath = path.join(__dirname, '../', '../', 'templates');

    private tsconfigPath = path.resolve('tsconfig.json');

    configAndWorkingDirs() {
        const tsconfig = require(this.tsconfigPath);
        const tsPaths = tsconfig?.compilerOptions?.paths;
        const vendorPath = { '.vendor/_utils/interfaces': ['./_vendor/_utils/interfaces'] };

        tsconfig.compilerOptions.paths = tsPaths ? { ...tsPaths, ...vendorPath } : vendorPath;
        fs.writeFileSync(this.tsconfigPath, JSON.stringify(tsconfig, null, 2));

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

    indexCss(publicPath = 'public', cssPaths: Array<string>) {
        const vendorFolder = path.resolve(publicPath, 'vendor');

        if (!fs.existsSync(vendorFolder)) {
            fs.mkdirSync(vendorFolder, { recursive: true });
        }

        const imports = cssPaths.reduce((acc, i) => {
            if (fs.lstatSync(path.resolve(publicPath, 'vendor', i)).isDirectory()) {
                acc += `@import "./${i}/index.css";\n`;
            }

            return acc;
        }, '');

        fs.writeFileSync(path.resolve(publicPath, 'vendor', 'index.css'), imports);
        fs.copyFileSync(path.join(this.templatesPath, 'scripts', 'public.js'), path.join(vendorFolder, 'index.js'));
        const clientHtmlPath = path.resolve(publicPath, 'index.html');
        const clientHtml = fs.readFileSync(clientHtmlPath).toString();
        const script = `<script src="./vendor/index.js"></script>\n`;
        fs.writeFileSync(clientHtmlPath, updateFile.insertTextNextToWord(clientHtml, '</body>', script, 'before'));
    }

    async addWatcher(urls: Array<{ wsUrl: string }>, publicPath = 'public') {
        const publicScriptPath = path.join(this.templatesPath, 'scripts', 'public.js');
        const content = fs.readFileSync(publicScriptPath).toString();

        const wsString = urls.reduce((acc, i) => {
            acc += `'${i.wsUrl}'`;

            return acc;
        }, '');

        const script = `
        [${wsString}].forEach((url) => {
        const ws = new WebSocket(url);
        ws.onmessage = function (res) {
            const { event, data } = JSON.parse(res.data);
            if (event === 'updateEntry' && data?.folder === 'bundle') {
                setTimeout(reloadCss, 500);
            }
        };
    });
        `;

        await fs.writeFileSync(path.resolve(publicPath, 'vendor', 'index.js'), updateFile.insertTextNextToWord(content, '//watcher', script, 'before'));
    }

    aliases(remote: IConfig['remote']) {
        const { bundler, typesPaths } = remote.entries.reduce(
            (acc, entry) => {
                acc.bundler += `'${entry.name}/v_${entry.version}': path.resolve('.vendor', 'input', '${entry.name}', 'v_${entry.version}', 'bundle', 'index.js')\n,`;
                acc.typesPaths[`${entry.name}/v_${entry.version}`] = [`./_vendor/input/${entry.name}/v_${entry.version}/types`];

                return acc;
            },
            { bundler: '', typesPaths: {} }
        );

        fs.writeFileSync(path.join(paths.utils, 'aliases.js'), `import path from 'path';\n export default {${bundler}}`);
        const tsconfig = require(this.tsconfigPath);
        const tsPaths = tsconfig?.compilerOptions?.paths;

        tsconfig.compilerOptions.paths = tsPaths ? { ...tsPaths, ...typesPaths } : typesPaths;
        fs.writeFileSync(this.tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }
}

export default new FilesCreator();
