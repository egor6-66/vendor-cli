import { exec } from 'child_process';
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
        if (this.config.expose?.entries.length) {
            status.success(`⏳ compiling started⏳ `);
            createFile.description(this.config);
            this.args.watch && createFile.esbuildWatcher();
            createFile.esbuildConfig(this.config, () => {
                createFile.esbuild(this.config, () => {
                    cmd.run(`ts-node .vendor/_utils/esbuild`, (error) => {
                        if (error) {
                            status.error(`Failed to build scripts ${error}`);
                        } else {
                            this.buildTypes();
                        }
                    });
                });
            });
        } else {
            status.error(`there are no "exposes" field in the config`);
        }
    }

    buildTypes() {
        createFile
            .types(this.config)
            .then((entryNames) => {
                if (entryNames?.length) {
                    this.finish(entryNames);
                }
            })
            .catch((error: string) => {
                status.error(error);
            });
    }

    finish(entryNames: Array<string>) {
        Promise.all(
            entryNames.map(async (name) => {
                const size = await getSize.dir(path.join(outputPath, name));
                status.info(`⚖️ ${name} sizes =>`, size);
            })
        ).then(() => {
            status.success(`👌Compiled successful👌 `);

            if (this.args.runServer) {
                Server.staticServer(this.args);
            }

            if (this.args.watch) {
                status.success(`👀 Watcher running 👀 `);
                exec('ts-node .vendor/_utils/esbuild/watcher.ts');
                Server.staticServer(this.args);
            }
        });
    }
}

export default Build;
