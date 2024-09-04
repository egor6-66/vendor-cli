import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { emitter, paths, updateFile } from '../../utils';

const html = (emitter: emitter.IEmitter) => ({
    name: 'html',
    setup(build: PluginBuild) {
        build.onStart(() => {
            fs.readdir(build.initialOptions.outdir, (err, files) => {
                files.forEach((file) => {
                    const ext = file.split('.').pop();

                    if (ext !== 'html') {
                        fs.unlinkSync(path.join(build.initialOptions.outdir, file));
                    }
                });
            });
        });
        build.onEnd((res) => {
            const playgroundHtmlPath = path.join(paths.playground, 'index.html');
            const html = fs.readFileSync(paths.templateHtml).toString();

            const newHtml = Object.keys(res?.metafile?.outputs).reduce((acc, key) => {
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
                emitter.emit('renderHTML');
            });
        });
    },
});

export default html;
