import path from 'path';

export const projectName = 'vendor';
export const packageName = `${projectName}-cli`;
export const resourcesPath = path.resolve(`.${projectName}`);

export enum serverType {
    DIST = 'distributor',
    CLIENT = 'client',
}
