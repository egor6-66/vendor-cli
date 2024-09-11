import { PluginBuild } from 'esbuild';
import path from 'path';

import { IArchive } from '../../interfaces/expose';
import { debounce, getSize, message, paths, zip } from '../../utils';

const buildBundle = (location: string, archiveOptions: Required<IArchive>, cb: () => void) => ({
    name: 'build-bundle',
    setup(build: PluginBuild) {
        build.onStart(() => {
            message('info', `${location} compiling...`);
        });

        build.onEnd(async (result) => {
            const bundlePath = path.join(paths.output, location);

            const { append, archive, stream } = zip.compress({ pathToDir: bundlePath, fileName: 'bundle.zip', ...archiveOptions });

            await Promise.allSettled(
                result.outputFiles.map(async (file) => {
                    const fileName = file.path.split(path.sep).pop();
                    await append.buffer(Buffer.from(file.text, 'utf8'), fileName);
                })
            ).then(async () => {
                await archive.finalize();
                stream.on('close', () => {
                    message('success', `bundle ${location} compiled successfully. size => ${getSize.bytesToSize(stream.bytesWritten)}`);
                    debounce(cb(), 200);
                });
            });
        });
    },
});

export default buildBundle;
