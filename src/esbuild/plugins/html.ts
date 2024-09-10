import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { message, paths, updateFile } from '../../utils';

const html = (htmlPath: string) => ({
    name: 'html',
    setup(build: PluginBuild) {
        build.onStart(() => {
            fs.readdir(paths.playground, (err, files) => {
                files.forEach((file) => {
                    if (file.split('.').pop() !== 'html') {
                        fs.unlinkSync(path.join(paths.playground, file));
                    }
                });
            });
        });

        build.onEnd((res) => {
            const html = fs.readFileSync(path.resolve(htmlPath), 'utf8');
            // const updHtml = updateFile.insertTextNextToWord(html, '<head>', '\n<meta http-equiv="refresh" content="3" />', 'after');

            const newHtml = Object.keys(res.metafile.outputs).reduce((acc, key) => {
                const name = key.split('/').pop();
                const ext = key.split('.').pop();

                if (ext === 'js') {
                    acc = updateFile.insertTextNextToWord(acc, '</body>', `<script src="${name}"></script>`, 'before');
                }

                if (ext === 'css') {
                    acc = updateFile.insertTextNextToWord(acc, '</head>', `<link rel="stylesheet" href="${name}"/>`, 'before');
                }

                return acc;
            }, html);

            fs.writeFileSync(path.join(paths.playground, 'index.html'), newHtml);
            message('success', 'playground rebuild');
        });
    },
});

export default html;
