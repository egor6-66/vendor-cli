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

export const inputJsPath = path.join(inputPath, 'js');
export const inputTsPath = path.join(inputPath, 'ts');
export const inputFilesPath = path.join(inputPath, 'files');

export const outputJsPath = path.join(outputPath, 'js');
export const outputTsPath = path.join(outputPath, 'ts');
export const outputFilesPath = path.join(outputPath, 'files');

export const esbuildName = 'esbuild.ts';
export const esbuildPath = path.join(utilsPath, esbuildName);
