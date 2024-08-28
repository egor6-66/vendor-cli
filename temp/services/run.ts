import fs from 'fs';
import path from 'path';
import util from 'util';

import { serverType } from '../constants';
import state from '../state';
import { IClientConfig, IDistConfig } from '../types';
import { status } from '../utils';

import GenerateTypes from './generateTypes';
import Server from './server';

class Run {
    private pluginsPath = path.join(__dirname, '../', '../', '../', 'plugins');

    constructor(config: IClientConfig | IDistConfig) {
        console.log('wdad');

        if (state.get('serverType') === 'distributor') {
            this.generateDistPlugins(config as IDistConfig);
        }

        if (state.get('serverType') === 'client') {
            this.generateClientPlugins(config as IClientConfig);
        }
    }

    private generateDistPlugins(config: IDistConfig) {
        // const pluginPath = path.join(this.pluginsPath, `${serverType.DIST}.ts`);
        // fs.unlinkSync(pluginPath);
        // fs.appendFileSync(pluginPath, "import { container } from 'webpack'; \n \n");
        // const chunks: string[] = [];
        // config.entries.forEach(({ version, name, exposes, shared }, index) => {
        //     if (chunks.includes(name)) {
        //         status.error('duplicate name');
        //     }
        //
        //     for (const i of Object.values(exposes)) {
        //         if (!fs.existsSync(path.resolve(i))) {
        //             status.error(`file not found ${i}`);
        //         }
        //     }
        //
        //     const template = { name, filename: `remote_${name}${version ? '_v' + version : ''}.js`, exposes, shared };
        //
        //     if (!shared?.length) delete template.shared;
        //
        //     index === 0 && fs.appendFileSync(pluginPath, `const configs = [\n`);
        //     fs.appendFileSync(pluginPath, `${util.inspect(template)},\n`);
        //     index === config.entries.length - 1 && fs.appendFileSync(pluginPath, `]\n \n`);
        //     chunks.push(name);
        // });
        // fs.appendFileSync(pluginPath, `export const chunks = ${util.inspect(chunks)}\n`);
        // fs.appendFileSync(pluginPath, `export default configs.map((config) => new container.ModuleFederationPlugin(config));`);
        // new GenerateTypes(config, () => {
        //     new Server(config);
        // });
    }

    private generateClientPlugins(config: IClientConfig) {
        const pluginPath = path.join(this.pluginsPath, `${serverType.CLIENT}.ts`);
        fs.writeFileSync(pluginPath, "import { container } from 'webpack';\n");
        fs.appendFileSync(
            pluginPath,
            `export default new container.ModuleFederationPlugin({
        remotes: ${util.inspect(config.remotes)}
        })`
        );
    }
}

export default Run;
