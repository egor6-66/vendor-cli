import path from 'path';

export const projectName = 'vendor';

export const configName = `${projectName}.config.ts`;
export const configPath = path.resolve(configName);

export const resourcesName = `.${projectName}`;
export const resourcesPath = path.resolve(resourcesName);
export const publicPath = path.resolve('public');

export const utilsPath = path.join(resourcesPath, '_utils');
export const inputPath = path.join(resourcesPath, 'input');
export const outputPath = path.join(resourcesPath, 'output');

export const descriptionPath = path.join(outputPath, 'description.ts');

export const esbuildFolderPath = path.join(utilsPath, 'esbuild');
export const esbuildConfigPath = path.join(esbuildFolderPath, 'config.ts');
export const esbuildWatcherPath = path.join(esbuildFolderPath, 'watcher.ts');
export const esbuildPath = path.join(esbuildFolderPath, 'index.ts');
export const publicCssPath = path.join(publicPath, projectName);
