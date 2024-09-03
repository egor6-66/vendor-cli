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
            const bytes = Object.values(result?.metafile?.outputs).reduce((acc, i) => (acc += i.bytes), 0);
            const size = getSize.bytesToSize(bytes);
            message('success', `${entryName} compiled successfully. size => ${size}`);
            emitter.emit('updateEntry', entryName);
        });
    },
});

export default rebuildNotify;
