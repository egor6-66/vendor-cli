import fs, { mkdirSync } from 'fs';
import path from 'path';
import WebSocket from 'ws';

import { IConfig } from '../interfaces';
import { message, paths, zip } from '../utils';

import FilesCreator from './filesCreator';

class Link {
    config!: IConfig;

    cssPaths: Array<string> = [];

    constructor(config: IConfig) {
        this.config = config;

        if (config?.remote?.entries?.length) {
            this.downloadFiles(config.remote);
        }
    }

    downloadFiles(remote: IConfig['remote']) {
        Promise.all(
            remote.entries.map(async (entry) => {
                const url = entry?.url || remote.url;

                return await this.downloadFile(url, 1, entry.name, ['bundle', 'types'], entry?.pass);
            })
        ).then(() => {
            FilesCreator.bootstrap(this.cssPaths);
            this.getRemoteConfigs(remote).then(async (res: any) => {
                if (!res?.length) return;
                res.forEach(({ wsUrl }) => {
                    if (wsUrl) {
                        const ws = new WebSocket(wsUrl);

                        ws.on('message', (message: string) => {
                            const { event, data } = JSON.parse(message);

                            if (event === 'updateEntry') {
                                remote.entries.forEach((entry) => {
                                    if (data.version === entry.version && data.name === entry.name && (remote.watch || entry.watch)) {
                                        const url = entry?.url || remote?.url;
                                        this.downloadFile(url, entry.version, entry.name, [data.folder], entry?.pass);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    }

    async downloadFile(url, version, entryName: string, folders: Array<'bundle' | 'types'>, pass?: string) {
        const outputPath = path.join(paths.input, entryName, `v_${version}`);

        try {
            return await Promise.allSettled(
                folders.map(async (folder) => {
                    return await fetch(`${url}/output/${entryName}/v_${version}/${folder}.zip`, { cache: 'no-cache' })
                        .then((res) => res.arrayBuffer())
                        .then(async (buffer) => {
                            const files = await zip.unzip(buffer, outputPath, pass, `${folder}/${entryName}`);
                            files.forEach((file) => {
                                if (file.path === 'index.css') {
                                    this.cssPaths.push(`${entryName}/v_${version}`);
                                }
                            });
                        })
                        .then(() => {
                            message('success', `${entryName} ${folder} updated.`);
                        })
                        .catch((e) => {
                            if (folder === 'bundle') {
                                message('warning', `${entryName} not found on remote host.`);
                            }
                        });
                })
            );
        } catch (e) {
            message('error', e);
        }
    }

    async getRemoteConfigs(remote: IConfig['remote']) {
        const urls = remote.entries.reduce((acc, entry) => {
            const url = entry?.url || remote.url;
            !acc.includes(url) && acc.push(url);

            return acc;
        }, []);

        return Promise.all(
            urls.map(async (url) => {
                return await fetch(`${url}/remoteConfig`)
                    .then((res) => res.json())
                    .then((data) => {
                        return {
                            wsUrl: `ws://${url.split('//')[1].split(':')[0]}:${data.wsPort}/ws`,
                        };
                    });
            })
        );
    }
}

export default Link;
