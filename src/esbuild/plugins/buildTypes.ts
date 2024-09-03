import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { cmd, getSize, message, paths, zip } from '../../utils';

const buildTypes = {
    name: 'build-types',
    setup(build: PluginBuild) {
        const entryName = build.initialOptions.entryNames;
        build.onStart(() => {
            message('info', `${entryName} types generation...`);
        });
        build.onEnd(() => {
            const entryDir = path.join(paths.output, entryName);
            const tsConfig = path.join(entryDir, 'tsconfig.json');
            const typesDir = path.join(entryDir, 'types');

            if (fs.existsSync(tsConfig)) {
                cmd.exec(`tsc -p ${tsConfig}`)
                    .then(async () => {
                        const typeSize = await getSize.dir(typesDir);
                        // zip.compress(typesDir, path.join(entryDir, 'types.zip'));
                        message('success', `${entryName} types generation successfully. size => ${typeSize}`);
                    })
                    .catch((error) => {
                        message('error', error);
                    });
            }
        });
    },
};

export default buildTypes;
