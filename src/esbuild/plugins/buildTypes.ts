import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { cmd, getSize, message } from '../../utils';

const buildTypes = (location: string) => ({
    name: 'build-types',
    setup(build: PluginBuild) {
        const outdir = build.initialOptions.outdir;
        build.onStart(() => {
            message('info', `${location} types generation...`);
        });
        build.onEnd(() => {
            const tsConfig = path.join(outdir, 'tsconfig.json');
            const typesDir = path.join(outdir, 'types');

            if (fs.existsSync(tsConfig)) {
                cmd.exec(`tsc -p ${tsConfig}`).then(async () => {
                    const typeSize = await getSize.dir(typesDir);
                    message('success', `${location} types generation successfully. size => ${typeSize}`);
                });
            }
        });
    },
});

export default buildTypes;
