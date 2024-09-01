import { Plugin } from 'esbuild';
import path from 'path';

import { getSize, message } from '../../utils';

const htmlPlugin: Plugin = {
    name: 'html-plugin',
    setup(build) {
        const outDir = path.resolve('build');
        build.onStart(async () => {
            // try {
            //     message('success', 'run build...');
            // } catch (e) {
            //     console.log(e);
            // }
        });
        build.onEnd((res) => {
            Object.entries(res.metafile.outputs).forEach(([key, val]) => {
                const extension = key.split('.').pop();
                const name = key.split('/').pop();
                // console.log(res);

                if (extension === 'js' || extension === 'css') {
                    // console.log(`output size ${name} => ${getSize.bytesToSize(val.bytes)}`);
                    // message('success', `output size ${name} => ${getSize.bytesToSize(val.bytes)}`);
                }
            });
            // message('success', 'build was successful');
        });
    },
};

export default htmlPlugin;
