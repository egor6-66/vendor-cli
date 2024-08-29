import cmd from 'node-cmd';
import path from 'path';

import { outputPath } from '../constants';
import { IConfig } from '../types';
import { createFile } from '../utils';
import { getSize, status } from '../utils';

class Build {
    constructor(config: IConfig) {
        this.buildScripts(config);
    }

    buildScripts(config: IConfig) {
        if (config.exposes?.entries.length) {
            status.success(` ⏳ compiling started⏳ `.toUpperCase());
            createFile.esbuild(config, () => {
                cmd.run(`ts-node .vendor/_utils/esbuild`, async (error, e, f) => {
                    if (error) {
                        status.error(`Failed to build scripts ${error}`);
                    } else {
                        this.buildTypes(config);
                    }
                });
            });
        }
    }

    buildTypes(config: IConfig) {
        createFile.types(config).then((chunks) => {
            chunks?.length && this.showSize(chunks);
        });
    }

    showSize(chunks: Array<string>) {
        Promise.all(
            chunks.map(async (chunk) => {
                const jsSize = getSize.file(path.join(outputPath, 'js', `${chunk}.js`));
                const cssSize = getSize.file(path.join(outputPath, 'css', `${chunk}.css`));
                const typesSize = await getSize.dir(path.join(outputPath, 'ts', chunk));
                status.info(`⚖️ ${chunk} size `, '');
                jsSize && status.info('\tjs =>', jsSize);
                cssSize && status.info('\tcss =>', cssSize);
                typesSize && status.info('\ttypes =>', typesSize);
            })
        ).then(() => {
            status.success(`👌Compiled successful👌 `.toUpperCase());
        });
    }
}

export default Build;
