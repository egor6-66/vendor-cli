import fs, { mkdirSync } from 'fs';
import path from 'path';
import WebSocket from 'ws';

import { IConfig } from '../interfaces';
import { constants, message, paths } from '../utils';

const AdmZip = require('adm-zip');
class Link {
    config!: IConfig;

    constructor(config: IConfig) {
        this.config = config;

        if (config?.remote?.entries?.length) {
            this.downloadFiles(config.remote);

            this.getRemoteConfigs(config.remote).then((res) => {
                res.forEach(({ wsUrl, socketEvent, version, entryName, host }) => {
                    if (wsUrl) {
                        const ws = new WebSocket(wsUrl);
                        ws.on('message', (message: string) => {
                            const data = JSON.parse(message);

                            if (data.event === socketEvent) {
                                this.downloadFile(host, version, entryName, [data.data.folder]);
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
                const host = entry?.host || remote.host;

                return await this.downloadFile(host, 1, entry.name, ['bundle', 'types']);
            })
        );
    }

    async downloadFile(host, version, entryName: string, folders: Array<'bundle' | 'types'>) {
        const url = `${host}/output/${entryName}/v_${version}/`;
        const outputPath = path.join(paths.input, entryName, `v_${version}`);

        try {
            if (!fs.existsSync(outputPath)) {
                mkdirSync(outputPath, { recursive: true });
            }

            folders.map(async (folder) => {
                return await fetch(`${url}/${folder}.zip`, { cache: 'no-cache' })
                    .then((res) => res.arrayBuffer())
                    .then(async (buffer) => {
                        const zip = new AdmZip(Buffer.from(buffer));
                        const zipEntries = zip.getEntries();

                        return await Promise.all(
                            zipEntries.map(async (i) => {
                                const entryPath = path.join(outputPath, folder, i.entryName);

                                if (fs.existsSync(entryPath) && !fs.lstatSync(entryPath).isDirectory()) {
                                    await fs.unlinkSync(entryPath);
                                }

                                zip.extractEntryTo(i.entryName, path.join(outputPath, folder));
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
        return Promise.all(
            remote.entries.map(async (entry) => {
                const host = entry?.host || remote.host;
                const port = entry?.port || remote.port || constants.ports.server;

                return await fetch(`${host}:${port}/remoteConfig`)
                    .then((res) => res.json())
                    .then((data) => {
                        return {
                            wsUrl: `ws://${host.split('//')[1].split(':')[0]}:${data.wsPort}`,
                            socketEvent: `${entry.name}.v_${entry.version}`,
                            host: host,
                            version: entry.version,
                            entryName: entry.name,
                        };
                    });
            })
        );
    }
}

export default Link;
