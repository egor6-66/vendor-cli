#! /usr/bin/env node

const { Command } = require('commander');
const program = new Command();
import * as services from './services';

(() => {
    program
        .command('init')
        .action(() => {
            services.FilesCreator.configAndWorkingDirs();
        })
        .description('Creating config and working directories.');

    program
        .command('build')
        .option('--watch', 'Tracks changes in files.')
        .option('--server', 'Starts a server for distributing static content.')
        .action((args) => {
            new services.Builder(args);
        })
        .description('Compiles all the packages you want to expose.');

    program.parse(process.argv);
})();
