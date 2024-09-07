import fs, { mkdirSync } from 'fs';
import path from 'path';
import WebSocket from 'ws';

import { IConfig } from '../interfaces';
import { message, paths } from '../utils';

import FilesCreator from './filesCreator';

const AdmZip = require('adm-zip');
class Link {
    config!: IConfig;

    constructor(config: IConfig) {
        this.config = config;

        if (config?.remote?.entries?.length) {
            this.downloadFiles(config.remote);

            this.getRemoteConfigs(config.remote).then((res: any) => {
                if (!res?.length) return;
                FilesCreator.public(res, config.remote.publicPath);
                FilesCreator.indexCss(config.remote.publicPath);
                res.forEach(({ wsUrl }) => {
                    if (wsUrl) {
                        const ws = new WebSocket(wsUrl);

                        ws.on('message', (message: string) => {
                            const { event, data } = JSON.parse(message);
                            console.log(data);

                            if (event === 'updateEntry') {
                                config.remote.entries.forEach((entry) => {
                                    if (data.version === entry.version && data.name === entry.name && entry.watch) {
                                        const url = entry?.url || config.remote?.url;
                                        this.downloadFile(url, entry.version, entry.name, [data.folder]);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    }

    async downloadFiles(remote: IConfig['remote']) {
        return Promise.all(
            remote.entries.map(async (entry) => {
                const url = entry?.url || remote.url;

                return await this.downloadFile(url, 1, entry.name, ['bundle', 'types']);
            })
        );
    }

    async downloadFile(url, version, entryName: string, folders: Array<'bundle' | 'types'>) {
        const outputPath = path.join(paths.input, entryName, `v_${version}`);

        try {
            if (!fs.existsSync(outputPath)) {
                mkdirSync(outputPath, { recursive: true });
            }

            folders.map(async (folder) => {
                return await fetch(`${url}/output/${entryName}/v_${version}/${folder}.zip`, { cache: 'no-cache' })
                    .then((res) => res.arrayBuffer())
                    .then(async (buffer) => {
                        const zip = new AdmZip(Buffer.from(buffer));
                        const zipEntries = zip.getEntries();

                        return await Promise.all(
                            zipEntries.map(async (i) => {
                                const entryPath = path.join(outputPath, folder, i.entryName);

                                if (i.entryName === 'index.css' || i.entryName === 'index.css.map') {
                                    const sccPath = path.resolve(this.config?.remote?.publicPath || 'public', 'vendor');
                                    const cssEntry = path.join(sccPath, entryName, 'index.css');

                                    if (fs.existsSync(cssEntry)) {
                                        await fs.unlinkSync(cssEntry);
                                        await fs.unlinkSync(`${cssEntry}.map`);
                                    }

                                    zip.extractEntryTo(i.entryName, path.join(sccPath, entryName));
                                } else {
                                    if (fs.existsSync(entryPath) && !fs.lstatSync(entryPath).isDirectory()) {
                                        await fs.unlinkSync(entryPath);
                                    }

                                    zip.extractEntryTo(i.entryName, path.join(outputPath, folder));
                                }
                            })
                        );
                    })
                    .then(() => {
                        message('success', `${entryName} ${folder} updated`);
                    });
            });
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
