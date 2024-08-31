import { join, resolve } from 'path';

import { configName, workingDirName } from './constants';

export const workingDir = resolve(workingDirName);
export const config = resolve(configName);
export const utils = join(workingDir, '_utils');
export const input = join(workingDir, 'input');
export const output = join(workingDir, 'output');
export const compiledConfig = resolve(utils, 'vendor.config.js');
export const esbuild = join(utils, 'esbuild');
export const esbuildConfig = join(esbuild, 'config.ts');
export const configBuilder = join(esbuild, 'configBuilder.ts');
export const esbuildWatcher = join(esbuild, 'watcher.ts');
export const esbuildBuilder = join(esbuild, 'builder.ts');
