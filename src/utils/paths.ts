import { join, resolve } from 'path';

import { configName, workingDirName } from './constants';

export const workingDir = resolve(workingDirName);
export const config = resolve(configName);
export const utils = join(workingDir, '_utils');
export const docker = join(utils, 'docker-nginx');
export const input = join(workingDir, 'input');
export const output = join(workingDir, 'output');

export const playground = join(workingDir, 'playground');
export const esbuild = join(__dirname, '..', 'esbuild');
export const compiledConfig = join(esbuild, 'vendor.config.js');
