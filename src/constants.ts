import path from 'path';

export const projectName = 'vendor';

export const configName = `${projectName}.config.ts`;
export const configPath = path.resolve(configName);

export const resourcesName = `.${projectName}`;
export const resourcesPath = path.resolve(resourcesName);

export const utilsPath = path.join(resourcesPath, '_utils');
export const inputPath = path.join(resourcesPath, 'input');
export const outputPath = path.join(resourcesPath, 'output');

export const descriptionPath = path.join(outputPath, 'description.ts');

export const esbuildFolderPath = path.join(utilsPath, 'esbuild');
export const esbuildPath = path.join(esbuildFolderPath, 'index.ts');
