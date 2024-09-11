import { PluginBuild } from 'esbuild';

import { message } from '../../utils';

const html = (cb: (ext: string) => void) => ({
    name: 'html',
    setup(build: PluginBuild) {
        build.onEnd((res) => {
            Object.keys(res.metafile.outputs).forEach((key) => {
                const ext = key.split('.').pop();

                if (ext === 'js' || ext === 'css') {
                    cb(ext);
                }
            });
            message('info', 'playground rebuild');
        });
    },
});

export default html;
