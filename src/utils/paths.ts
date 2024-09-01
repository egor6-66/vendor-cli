import { join, resolve } from 'path';

import { configName, workingDirName } from './constants';

export const workingDir = resolve(workingDirName);
export const config = resolve(configName);
export const utils = join(workingDir, '_utils');
export const input = join(workingDir, 'input');
export const output = join(workingDir, 'output');

export const esbuild = join(__dirname, '..', 'esbuild');
export const esbuildConfig = join(esbuild, 'config.js');
export const configBuilder = join(esbuild, 'configBuilder.js');
export const esbuildWatcher = join(esbuild, 'watcher.js');
export const esbuildBuilder = join(esbuild, 'builder.js');
export const compiledConfig = resolve(esbuild, 'vendor.config.js');
