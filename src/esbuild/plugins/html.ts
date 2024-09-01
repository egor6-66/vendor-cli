import { Plugin } from 'esbuild';
import path from 'path';

const htmlPlugin: Plugin = {
    name: 'html-plugin',
    setup(build) {
        const outDir = path.resolve('build');
        build.onStart(async () => {
            try {
                console.log('build');
            } catch (e) {
                console.log(e);
            }
        });
        build.onEnd((res) => {
            console.log(res);
        });
    },
};

export default htmlPlugin;
