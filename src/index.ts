#! /usr/bin/env node

import path from 'path';

const { Command } = require('commander');
const program = new Command();
import { build } from 'esbuild';

import { IConfig } from './interfaces';
import * as services from './services';
import { emitter, message } from './utils';

class Root {
    constructor() {
        this.commands();
        program.parse(process.argv);
    }

    commands() {
        program
            .command('init')
            .action(() => {
                services.FilesCreator.configAndWorkingDirs();
            })
            .description('Creating config and working directories.');

        program
            .command('build')
            .action(async () => {
                const config = await this.getConfig();
                new services.Builder(config, emitter);
            })
            .description('Compiles all the packages you want to expose.');

        program
            .command('link')
            .action(async () => {
                const config = await this.getConfig();
                new services.Link(config);
            })
            .description('Creating config and working directories.');
    }

    async getConfig(): Promise<IConfig> {
        try {
            await build({
                outdir: path.join(__dirname),
                entryNames: 'config',
                entryPoints: [path.resolve('vendor.config.ts')],
                bundle: true,
                platform: 'node',
                minify: true,
                sourcemap: false,
            });

            return require(path.join(__dirname, 'config.js')).default;
        } catch (e) {
            message('error', e);
        }
    }
}

export default new Root();
