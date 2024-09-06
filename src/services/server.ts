import express from 'express';
import path from 'path';
import { WebSocketServer } from 'ws';

import { IConfig } from '../interfaces';
import { cmd, constants, emitter, message, paths } from '../utils';

class Server {
    config!: IConfig;

    app = express();

    headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
    };

    constructor(config: IConfig, emitter: emitter.IEmitter) {
        if (config) {
            this.config = config;
            this.startServer(emitter);
        }
    }

    async startServer(emitter: emitter.IEmitter) {
        const port = this.config?.expose?.server?.port || constants.ports.server;
        const wsPort = this.config?.expose?.server.wsPort || constants.ports.ws;
        const serveStatic = this.config?.expose?.server?.serveStatic;

        const remoteConfig = {
            wsPort: wsPort,
        };

        this.app.get('/remoteConfig', (req: any, res) => {
            res.send(remoteConfig);
        });

        if (serveStatic === 'nginx') {
            await this.nginxServer();
        }

        if (serveStatic === 'node') {
            this.app.use('/playground', express.static(paths.playground));
            this.app.get('/output/:path*', (req: any, res) => {
                res.set(this.headers);
                res.appendHeader('Cache-Control', 'no-cache');
                res.sendFile(path.join(paths.output, req.params.path, req.params[0]));
            });
        }

        this.app.listen(port, () => {
            const wss = new WebSocketServer({
                port: wsPort,
                perMessageDeflate: {
                    zlibDeflateOptions: {
                        chunkSize: 1024,
                        memLevel: 7,
                        level: 3,
                    },
                    zlibInflateOptions: {
                        chunkSize: 10 * 1024,
                    },
                    clientNoContextTakeover: true,
                    serverNoContextTakeover: true,
                    serverMaxWindowBits: 10,
                    concurrencyLimit: 10,
                    threshold: 1024,
                },
            });

            wss.on('connection', (ws: WebSocket) => {
                const { sendMessage } = this.ws(ws);
                emitter.on('renderHTML', () => {
                    sendMessage('renderHTML');
                });
                emitter.on('updateBundle', (data) => {
                    sendMessage(`${data.name}.v_${data.version}`, { folder: 'bundle' });
                });
                emitter.on('updateTypes', (data) => {
                    sendMessage(`${data.name}.v_${data.version}`, { folder: 'types' });
                });
            });
            message('success', `🚀NODE server started on port ${port}🚀`);
        });
    }

    ws(ws: WebSocket) {
        return {
            sendMessage(event: string, data?: any) {
                ws.send(JSON.stringify({ event, data }));
            },
        };
    }

    async nginxServer() {
        await cmd.exec(`docker compose -f ${path.join(paths.docker, 'docker-compose.yml')} up --build -d`, ({ error, stdout }) => {
            error ? message('error', error) : message('info', stdout);
        });
        message('success', '🚀NGINX server started🚀');
    }
}

export default Server;
