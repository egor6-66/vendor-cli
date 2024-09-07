import { PluginBuild } from 'esbuild';

const html = (cb: (links: { css: Array<string>; js: Array<string> }) => void) => ({
    name: 'html',
    setup(build: PluginBuild) {
        build.onEnd((res) => {
            const links = Object.keys(res?.metafile?.outputs).reduce(
                (acc, key) => {
                    const name = key.split('/').pop();
                    const ext = name.split('.').pop();

                    if (ext === 'js') {
                        acc.js.push(name);
                    }

                    if (ext === 'css') {
                        acc.css.push(name);
                    }

                    return acc;
                },
                { css: [], js: [] }
            );

            cb(links);
        });
    },
});

export default html;
