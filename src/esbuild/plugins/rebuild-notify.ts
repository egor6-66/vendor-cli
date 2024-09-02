import { PluginBuild } from 'esbuild';

import { getSize, message } from '../../utils';

const rebuildNotify = {
    name: 'rebuild-notify',
    setup(build: PluginBuild) {
        const entryName = build.initialOptions.entryNames;
        build.onStart(() => {
            message('info', `${entryName} build...`);
        });
        build.onEnd((result) => {
            const size = getSize.bytesToSize(Object.values(result.metafile.outputs)[0].bytes);
            message('success', `${entryName} compiled successfully. size => ${size}`);
        });
    },
};

export default rebuildNotify;
