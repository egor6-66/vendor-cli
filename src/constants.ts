import path from 'path';

export const projectName = 'vendor';

export const configName = `${projectName}.config.ts`;
export const configPath = path.resolve(configName);

export const resourcesName = `.${projectName}`;
export const resourcesPath = path.resolve(resourcesName);
export const scriptsPath = path.join(resourcesPath, 'scripts');
export const typesPath = path.join(resourcesPath, 'types');

export const utilsPath = path.join(resourcesPath, '_utils');

export const esbuildName = 'esbuild.ts';
export const esbuildPath = path.join(utilsPath, esbuildName);
