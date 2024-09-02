import { PluginBuild } from 'esbuild';

import { getSize, message } from '../../utils';

let init = true;

const rebuildNotify = {
    name: 'rebuild-notify',
    setup(build: PluginBuild) {
        const entryName = build.initialOptions.entryNames;
        build.onStart(() => {
            !init && message('info', `${entryName} build...`);
        });
        build.onEnd((result) => {
            const size = getSize.bytesToSize(Object.values(result.metafile.outputs)[0].bytes);
            !init && message('info', `build success`);
            !init && message('success', `size ${entryName} => ${size}`);
            init = false;
        });
    },
};

export default rebuildNotify;
