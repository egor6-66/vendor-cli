import { PluginBuild } from 'esbuild';

import { emitter, getSize, message } from '../../utils';

const rebuildNotify = (emitter: emitter.IEmitter) => ({
    name: 'rebuild-notify',
    setup(build: PluginBuild) {
        const entryName = build.initialOptions.entryNames;
        build.onStart(() => {
            message('info', `${entryName} compiling...`);
        });
        build.onEnd((result) => {
            const bytes = Object.entries(result?.metafile?.outputs).reduce((acc, [key, val]) => {
                const name = key.split('/').pop();
                const ext = name.split('.').pop();

                if (ext === 'js' || ext === 'css') {
                    acc += val.bytes;
                }

                return acc;
            }, 0);

            const size = getSize.bytesToSize(bytes);
            message('success', `${entryName} compiled successfully. size => ${size}`);
            emitter.emit('updateEntry', entryName);
        });
    },
});

export default rebuildNotify;
