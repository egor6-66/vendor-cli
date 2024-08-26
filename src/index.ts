#! /usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import Commands from './services';

yargs(hideBin(process.argv)).command(Commands.init).command(Commands.build).demandCommand().help().argv;
