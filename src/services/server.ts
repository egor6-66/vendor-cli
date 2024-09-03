import { EventEmitter } from 'events';
import fs from 'fs';
import http, { ServerResponse } from 'http';
import path from 'path';

import { Config } from '../interfaces';
import { cmd, debounce, message, paths } from '../utils';

class Server {
    config!: Config.IConfig;

    emitter = new EventEmitter();

    headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
    };

    constructor(config: Config.IConfig) {
        if (config) {
            this.config = config;
            this.bootstrap();
        }
    }

    async bootstrap() {
        const server = this.config?.expose?.server?.server;

        if (server === 'node') {
            await this.nodeServer();
        }

        if (server === 'nginx') {
            await this.nginxServer();
        }
    }

    async playground(res: ServerResponse) {
        if (this.config.expose.server.playground.enabled) {
            res.writeHead(200, this.headers);
            // res.write('playground not activated');

            return this.emitter.on('refresh_html', () => {
                res.write('data: refresh\n\n');
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write('playground not activated');

            return res.end();
        }
    }

    async nodeServer() {
        const port = this.config?.expose?.server?.port || 8888;

        type Endpoints = '/playgroundRebuild';

        if (this.config.expose.server.playground.enabled) {
            fs.watch(
                path.join(paths.playground, 'index.html'),
                debounce(() => {
                    this.emitter.emit('refresh_html');
                }, 200)
            );
        }

        const server = http.createServer((req, res) => {
            const url = req.url as Endpoints;

            switch (url) {
                case '/playgroundRebuild':
                    return this.playground(res as ServerResponse);

                default:
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.write('404 Not Found');
                    res.end();
            }
        });

        server.listen(port, () => {
            message('success', `🚀NODE server started on port ${port}🚀`);
        });
    }

    async nginxServer() {
        await cmd.exec(`docker compose -f ${path.join(paths.docker, 'docker-compose.yml')} up --build -d`, ({ error, stdout }) => {
            error ? message('error', error) : message('info', stdout);
        });
        message('success', '🚀NGINX server started🚀');
    }
}

export default Server;
