import fs from 'fs';
import path from 'path';
import util from 'util';

import { serverType } from '../constants';
import { IClientConfig, IDistConfig } from '../types';
import { status } from '../utils';

import GenerateTypes from './generateTypes';

class Build {
    private pluginsPath = path.join(__dirname, '../', '../', '../', 'plugins');

    constructor(config: IClientConfig | IDistConfig) {
        if (config.type === 'distributor') {
            this.generateDistPlugins(config);
        }
    }

    private generateDistPlugins(config: IDistConfig) {
        const pluginPath = path.join(this.pluginsPath, `${serverType.DIST}.ts`);
        fs.unlinkSync(pluginPath);
        fs.appendFileSync(pluginPath, "import { container } from 'webpack'; \n \n");
        const chunks: string[] = [];
        config.entries.forEach(({ version, name, exposes, shared }, index) => {
            if (chunks.includes(name)) {
                status.error('duplicate name');
            }

            for (const i of Object.values(exposes)) {
                if (!fs.existsSync(path.resolve(i))) {
                    status.error(`no such file  ${i}`);
                }
            }

            const template = { name, filename: `remote_${name}${version ? '_v' + version : ''}.js`, exposes, shared };

            if (!shared?.length) delete template.shared;

            index === 0 && fs.appendFileSync(pluginPath, `const configs = [\n`);
            fs.appendFileSync(pluginPath, `${util.inspect(template)},\n`);
            index === config.entries.length - 1 && fs.appendFileSync(pluginPath, `]\n \n`);
            chunks.push(name);
        });
        fs.appendFileSync(pluginPath, `export const chunks = ${util.inspect(chunks)}\n`);
        fs.appendFileSync(pluginPath, `export default configs.map((config) => new container.ModuleFederationPlugin(config));`);
        new GenerateTypes(config);
    }
}

export default Build;
