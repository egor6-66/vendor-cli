import AdmZip from 'adm-zip';
import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { cmd, debounce, getSize, message, paths } from '../../utils';

const buildTypes = (location: string, cb: () => void) => ({
    name: 'build-types',
    setup(build: PluginBuild) {
        build.onStart(() => {
            message('info', `${location} types generation...`);
        });
        const zip = new AdmZip();
        build.onEnd(() => {
            const entryPath = path.join(paths.output, location);
            const typesDir = path.join(entryPath, 'types');
            const tsConfig = path.join(entryPath, 'tsconfig.json');

            if (fs.existsSync(tsConfig)) {
                cmd.exec(`tsc -p ${tsConfig}`).then(async () => {
                    const typeSize = await getSize.dir(typesDir);
                    message('success', `${location} types generation successfully. size => ${typeSize}`);
                    zip.addLocalFolder(typesDir);
                    await zip.writeZip(`${typesDir}.zip`);
                    fs.rmSync(typesDir, { recursive: true, force: true });
                    debounce(cb(), 200);
                });
            }
        });
    },
});

export default buildTypes;
