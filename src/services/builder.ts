import e from 'express';
import path from 'path';

import { cmd, getSize, message, paths } from '../utils';
import { interfaces } from '../utils';
import { esbuildBuilder } from '../utils/paths';

import FilesCreator from './filesCreator';

interface IArgs {
    watch: boolean;
    server: boolean;
}

class Builder {
    args!: IArgs;

    config!: interfaces.IConfig;

    constructor(args: IArgs) {
        this.args = args;
        message('info', '⏳ Compiling started...⏳');
        this.buildConfig().then((config) => {
            if (config) {
                this.config = config;

                if (config.expose?.entries.length) {
                    this.buildEntries();
                }
            }
        });
    }

    async buildConfig() {
        return await cmd<interfaces.IConfig>(`ts-node ${paths.configBuilder}`, () => {
            return require(paths.compiledConfig).default;
        });
    }

    async buildEntries() {
        await FilesCreator.esbuildConfig(this.config);
        await cmd(`ts-node ${paths.esbuildBuilder}`, async ({ error }) => {
            if (error) {
                message('error', error);
            } else {
                message('info', "⚙️Let's start compiling...⚙️");
                const entries = await FilesCreator.types(this.config);
                entries?.length && this.getSize(entries);
            }
        });
    }

    getSize(entryNames: Array<string>) {
        Promise.all(
            entryNames.map(async (name) => {
                const size = await getSize.dir(path.join(paths.output, name));
                message('info', `-------------sizes-------------`);
                message('info', `⚖️${name} => ${size}⚖️`);
                message('info', `-------------------------------`);
            })
        ).then(() => {
            message('success', `👌Compiled successful👌`);
        });
    }
}

export default Builder;
