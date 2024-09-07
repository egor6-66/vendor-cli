import fs, { mkdirSync } from 'fs';
import path from 'path';
import WebSocket from 'ws';

import { IConfig } from '../interfaces';
import { message, paths } from '../utils';

import FilesCreator from './filesCreator';

const AdmZip = require('adm-zip');
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

                return await this.downloadFile(url, 1, entry.name, ['bundle', 'types'], true);
            })
        ).then(() => {
            FilesCreator.indexCss(remote.publicPath, this.cssPaths);
            this.getRemoteConfigs(remote).then(async (res: any) => {
                if (!res?.length) return;
                await FilesCreator.addWatcher(res, remote.publicPath);
                res.forEach(({ wsUrl }) => {
                    if (wsUrl) {
                        const ws = new WebSocket(wsUrl);

                        ws.on('message', (message: string) => {
                            const { event, data } = JSON.parse(message);

                            if (event === 'updateEntry') {
                                console.log(data, this.cssPaths);
                                remote.entries.forEach((entry) => {
                                    if (data.version === entry.version && data.name === entry.name && (remote.watch || entry.watch)) {
                                        const url = entry?.url || remote?.url;
                                        this.downloadFile(url, entry.version, entry.name, [data.folder]);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    }

    async downloadFile(url, version, entryName: string, folders: Array<'bundle' | 'types'>, init?: boolean) {
        const outputPath = path.join(paths.input, entryName, `v_${version}`);

        try {
            if (!fs.existsSync(outputPath)) {
                mkdirSync(outputPath, { recursive: true });
            }

            return await Promise.all(
                folders.map(async (folder) => {
                    return await fetch(`${url}/output/${entryName}/v_${version}/${folder}.zip`, { cache: 'no-cache' })
                        .then((res) => res.arrayBuffer())
                        .then(async (buffer) => {
                            const zip = new AdmZip(Buffer.from(buffer));
                            const zipEntries = zip.getEntries();
                            const sccPath = path.resolve(this.config?.remote?.publicPath || 'public', 'vendor', entryName);

                            zipEntries.map(async (i) => {
                                if (i.entryName === 'index.css' || i.entryName === 'index.css.map') {
                                    if (i.entryName === 'index.css' && init) {
                                        this.cssPaths.push(entryName);
                                    }

                                    return zip.extractEntryTo(i.entryName, path.join(sccPath), true, true);
                                }

                                zip.extractEntryTo(i.entryName, path.join(outputPath, folder), true, true);
                            });
                        })
                        .then(() => {
                            message('success', `${entryName} ${folder} updated`);
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
