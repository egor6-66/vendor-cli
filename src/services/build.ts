import cmd from 'node-cmd';
import path from 'path';

import { outputPath } from '../constants';
import { IConfig } from '../types';
import { createFile } from '../utils';
import { getSize, status } from '../utils';

class Build {
    constructor(config: IConfig) {
        this.buildScripts(config, () => {
            this.buildTypes(config);
        });
    }

    buildScripts(config: IConfig, next: () => void) {
        if (config.exposes?.entries.length) {
            createFile.esbuild(config, () => {
                cmd.run(`ts-node .vendor/_utils/esbuild`, async (error) => {
                    error ? status.error(`Failed to build scripts ${error}`) : next();
                });
            });
        }
    }

    buildTypes(config: IConfig) {
        status.success(` ⏳ compiling started⏳ `.toUpperCase());
        createFile.types(config, async (entryName, done) => {
            const jsSize = getSize.file(path.join(outputPath, 'js', `${entryName}.js`));
            const cssSize = getSize.file(path.join(outputPath, 'css', `${entryName}.css`));
            const typesSize = await getSize.dir(path.join(outputPath, 'ts', entryName));
            status.info(`⚖️ ${entryName} size `, '');
            jsSize && status.info('\tjs =>', jsSize);
            cssSize && status.info('\tcss =>', cssSize);
            typesSize && status.info('\ttypes =>', typesSize);
            done && status.success(`👌Compiled successful👌 `.toUpperCase());
        });
    }
}

export default Build;
