import { Plugin } from 'esbuild';
import { EventEmitter } from 'events';
import path from 'path';

const server = () => {};

const emitterPlugin: Plugin = {
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
            console.log('emitterPlugin', res);
        });
    },
};

export default emitterPlugin;
