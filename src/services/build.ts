import cmd from 'node-cmd';
import path from 'path';

import { outputPath } from '../constants';
import { IBuildArgs, IConfig } from '../types';
import { createFile, getSize, status } from '../utils';

import Server from './server';

class Build {
    args!: IBuildArgs;

    config!: IConfig;

    constructor(config: IConfig, args: IBuildArgs) {
        this.args = args;
        this.config = config;
        this.buildScripts();
    }

    buildScripts() {
        if (this.config.exposes?.entries.length) {
            status.success(`⏳ compiling started⏳ `);
            createFile.description(this.config);
            createFile.esbuild(this.config, () => {
                cmd.run(`ts-node .vendor/_utils/esbuild`, (error) => {
                    if (error) {
                        status.error(`Failed to build scripts ${error}`);
                    } else {
                        this.buildTypes();
                    }
                });
            });
        }
    }

    buildTypes() {
        createFile
            .types(this.config)
            .then((entryNames) => {
                if (entryNames?.length) {
                    this.showSize(entryNames);
                }
            })
            .catch((error: string) => {
                status.error(error);
            });
    }

    showSize(entryNames: Array<string>) {
        Promise.all(
            entryNames.map(async (name) => {
                const size = await getSize.dir(path.join(outputPath, name));
                status.info(`⚖️ ${name} sizes =>`, size);
            })
        ).then(() => {
            status.success(`👌Compiled successful👌 `);
            new Server(this.args);
        });
    }
}

export default Build;
