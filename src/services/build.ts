import cmd from 'node-cmd';
import path from 'path';

import { outputJsPath, outputTsPath } from '../constants';
import { IConfig } from '../types';
import { createFile, getSize, status } from '../utils';

class Build {
    constructor(config: IConfig) {
        this.buildScripts(config);
    }

    buildScripts(config: IConfig) {
        if (config.exposes?.entries.length) {
            status.success(`⏳ compiling started⏳ `.toUpperCase());
            createFile.description(config);
            createFile.esbuild(config, () => {
                cmd.run(`ts-node .vendor/_utils/esbuild.ts`, (error) => {
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
            if (chunks?.length) {
                // this.showSize(chunks);
            }
        });
    }

    showSize(chunks: Array<string>) {
        Promise.all(
            chunks.map(async (chunk) => {
                const jsSize = getSize.file(path.join(outputJsPath, `${chunk}.js`));
                const typesSize = await getSize.dir(path.join(outputTsPath, chunk));
                status.info(`⚖️ ${chunk} sizes `, '');
                jsSize && status.info('\tjs =>', jsSize);
                typesSize && status.info('\ttypes =>', typesSize);
            })
        ).then(() => {
            status.success(`👌Compiled successful👌 `.toUpperCase());
        });
    }
}

export default Build;
