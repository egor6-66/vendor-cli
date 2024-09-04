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
        if (!config?.expose?.server) return;
        const clientHtmlPath = path.resolve(config?.expose?.server.playground.htmlPath);
        const clientHtml = fs.readFileSync(clientHtmlPath).toString();

        const script = `
<script>
const events = new EventSource('http://localhost:${config?.expose?.server?.port || 8888}/playgroundRebuild')
events.onmessage = () => { window.location.reload()}
</script>\n`;

        fs.writeFileSync(paths.templateHtml, updateFile.insertTextNextToWord(clientHtml, '</body>', script, 'before'));
    }
}

export default new FilesCreator();
