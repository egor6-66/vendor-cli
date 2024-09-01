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
        return await cmd.stream<any>(`ts-node ${paths.configBuilder}`, () => {
            return require(paths.compiledConfig).default;
        });
    }

    async buildEntries() {
        await FilesCreator.esbuildConfig(this.config);
        await cmd.stream(`ts-node ${path.join(__dirname, '..', 'esbuild', 'builder.js')}`, async ({ error, stdout }) => {
            console.log(stdout);

            if (error) {
                message('error', error);
            } else {
                message('info', "⚙️Let's start compiling...⚙️");
                const entries = await FilesCreator.types(this.config, this.args.watch);
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
            this.args.watch && this.watcher();
            this.args.server && this.server();
        });
    }

    watcher() {
        message('success', `👀 Watcher running 👀`);
        cmd.separate(`ts-node ${paths.esbuildWatcher}`);
    }

    async server() {
        const port = this.config.expose.port || 8888;
        message('success', `🚀Server started on PORT ${port}🚀 `);
        // cmd.stream(`ts-node ${this.serverPath} -- --port=${port}`);
        await cmd.stream(`docker compose  -f ${paths.utils}/docker-compose.yml up --build -d`);
    }
}

export default Builder;
