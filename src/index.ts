#! /usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import Commands from './services';

yargs(hideBin(process.argv))
    .command(Commands.init)
    .command(Commands.build)
    .command(Commands.devServer)
    .command(Commands.take)
    // .command(Commands.take)
    .demandCommand()
    .help().argv;
