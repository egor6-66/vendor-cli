import path from 'path';

import { Config } from '../interfaces';
import { cmd, getSize, message, paths } from '../utils';

import FilesCreator from './filesCreator';

interface IArgs {
    watch: boolean;
    server: boolean;
}

class Builder {
    args!: IArgs;

    config!: Config.IConfig;

    serverPath = path.join(__dirname, '../', 'server', 'index.js');

    constructor(args: IArgs) {
        this.args = args;
        message('info', '⏳ Compiling started...⏳');
        this.buildConfig().then(async (config) => {
            if (config) {
                this.config = config;

                if (config?.expose?.entries.length) {
                    await this.buildEntries();
                }
            }
        });
    }

    async buildConfig() {
        return await cmd.exec<any>(`ts-node ${paths.configBuilder}`, () => {
            return require(paths.compiledConfig).default;
        });
    }

    async buildEntries() {
        await FilesCreator.esbuildConfig(this.config);
        cmd.execSync(`ts-node ${this.args.watch ? paths.esbuildWatcher : paths.esbuildBuilder}`, async ({ msg, error }) => {
            error && message('error', error);
        });
        const entries = await FilesCreator.types(this.config, this.args.watch);
        entries?.length && this.getSize(entries);
    }

    getSize(entryNames: Array<string>) {
        message('info', `-------------sizes-------------`);
        Promise.all(
            entryNames.map(async (name) => {
                const size = await getSize.dir(path.join(paths.output, name));
                message('info', `⚖️${name} => ${size}⚖️`);
            })
        ).then(() => {
            message('info', `-------------------------------`);
            message('success', `👌Compiled successful👌`);
            this.args.watch && message('success', `👀 Watcher running 👀`);
            this.args.server && this.server();
        });
    }

    server() {
        cmd.execSync(`docker compose  -f ${paths.dockerCompose} up --build`);
        message('success', `🚀Server started🚀 `);
    }
}

export default Builder;
