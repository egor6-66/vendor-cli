import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { emitter, paths, updateFile } from '../../utils';

interface IProps {
    htmlPath: string;
    emitter: emitter.IEmitter;
}

const html = (props: IProps) => ({
    name: 'html',
    setup(build: PluginBuild) {
        build.onEnd((res) => {
            const playgroundHtmlPath = path.join(paths.playground, 'index.html');
            const html = fs.readFileSync(path.resolve(props.htmlPath)).toString();

            const newHtml = Object.keys(res.metafile.outputs).reduce((acc, key) => {
                const name = key.split('/').pop();
                const ext = name.split('.').pop();

                if (ext === 'js') {
                    acc = updateFile.insertTextNextToWord(acc, '</body>', `<script src="${name}"></script>\n`, 'before');
                }

                if (ext === 'css') {
                    acc = updateFile.insertTextNextToWord(acc, '</head>', `<link rel="stylesheet" href="${name}">\n`, 'before');
                }

                return acc;
            }, html);

            fs.writeFile(playgroundHtmlPath, newHtml, () => {
                props.emitter.emit('renderHTML');
            });
        });
    },
});

export default html;
