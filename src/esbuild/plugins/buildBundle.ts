import { PluginBuild } from 'esbuild';
import path from 'path';

const AdmZip = require('adm-zip');
import { debounce, getSize, message, paths } from '../../utils';

const buildBundle = (location: string, cb: () => void) => ({
    name: 'build-bundle',
    setup(build: PluginBuild) {
        build.onStart(() => {
            message('info', `${location} compiling...`);
        });
        const zip = new AdmZip();
        build.onEnd(async (result) => {
            const bundlePath = path.join(paths.output, location, 'bundle.zip');
            await Promise.all(
                result.outputFiles.map(async (file) => {
                    const fileName = file.path.split(path.sep).pop();
                    const STORED = 0;
                    await zip.addFile(fileName, Buffer.from(file.text, 'utf8'));
                    const entry = zip.getEntry(fileName);
                    entry.header.method = STORED;
                })
            );
            await zip.writeZip(bundlePath);
            const bundleSize = getSize.file(bundlePath);
            message('success', `bundle ${location} compiled successfully. size => ${bundleSize}`);
            debounce(cb(), 200);
        });
    },
});

export default buildBundle;
