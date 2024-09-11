import { PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

import { IArchive } from '../../interfaces/expose';
import { cmd, debounce, getSize, message, paths, zip } from '../../utils';

const buildTypes = (location: string, archiveOptions: Required<IArchive>, cb: () => void) => ({
    name: 'build-types',
    setup(build: PluginBuild) {
        build.onStart(() => {
            message('info', `${location} types generation...`);
        });

        build.onEnd(() => {
            const entryPath = path.join(paths.output, location);
            const typesDir = path.join(entryPath, 'types');
            const tsConfig = path.join(entryPath, 'tsconfig.json');

            if (fs.existsSync(tsConfig)) {
                const { append, archive, stream } = zip.compress({ pathToDir: entryPath, fileName: 'types.zip', ...archiveOptions });

                cmd.exec(`tsc -p ${tsConfig}`).then(async () => {
                    await append.directory(typesDir);
                    await archive.finalize();
                    stream.on('close', () => {
                        message('success', `${location} types generation successfully. size => ${getSize.bytesToSize(stream.bytesWritten)}`);
                        fs.rmSync(typesDir, { recursive: true });
                        debounce(cb(), 200);
                    });
                });
            }
        });
    },
});

export default buildTypes;
