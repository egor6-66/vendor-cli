import cmd from 'node-cmd';
import path from 'path';

import {} from '../constants';
import { IConfig } from '../types';
import { createFile, getSize, status } from '../utils';

interface IArgs {
    static: boolean;
    port: number;
}

class Build {
    args!: IArgs;

    config!: IConfig;

    constructor(config: IConfig, args: IArgs) {
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
        createFile.types(this.config).then((chunks) => {
            if (chunks?.length) {
                this.showSize(chunks);
            }
        });
    }

    showSize(chunks: Array<string>) {
        Promise.all(
            chunks.map(async (chunk) => {
                // const jsSize = getSize.file(path.join(outputJsPath, `${chunk}.js`));
                // const typesSize = await getSize.dir(path.join(outputTsPath, chunk));
                status.info(`⚖️ ${chunk} sizes `, '');
                // jsSize && status.info('\tjs =>', jsSize);
                // typesSize && status.info('\ttypes =>', typesSize);
            })
        ).then(() => {
            status.success(`👌Compiled successful👌 `);

            if (this.args.static) {
                const port = this.args.port || 8888;
                const serverPath = path.join(__dirname, '../', 'server', 'index.js');
                status.success(`🚀Static server started on port ${port}🚀 `);
                cmd.runSync(`ts-node ${serverPath} --port=${port}`);
            }
        });
    }
}

export default Build;
