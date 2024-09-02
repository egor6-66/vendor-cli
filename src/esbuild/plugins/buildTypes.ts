import { PluginBuild } from 'esbuild';
import path from 'path';

import { cmd, getSize, message, paths } from '../../utils';

const buildTypes = {
    name: 'build-types',
    setup(build: PluginBuild) {
        const entryName = build.initialOptions.entryNames;
        build.onStart(() => {
            message('info', `${entryName} types generation...`);
        });
        build.onEnd(() => {
            const entryDir = path.join(paths.output, entryName);
            cmd.exec(`tsc -p ${path.join(entryDir, 'tsconfig.json')}`)
                .then(async () => {
                    const typeSize = await getSize.dir(path.join(entryDir, 'types'));
                    message('success', `${entryName} types generation successfully. size => ${typeSize}`);
                })
                .catch((error) => {
                    message('error', error);
                });
        });
    },
};

export default buildTypes;
