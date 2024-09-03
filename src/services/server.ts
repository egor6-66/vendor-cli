import express from 'express';
import path from 'path';

import { Config } from '../interfaces';
import { cmd, emitter, message, paths } from '../utils';

class Server {
    config!: Config.IConfig;

    app = express();

    headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
    };

    constructor(config: Config.IConfig, emitter: emitter.IEmitter) {
        if (config) {
            this.config = config;
            this.startServer(emitter);
        }
    }

    async startServer(emitter: emitter.IEmitter) {
        const port = this.config?.expose?.server?.port || 8888;
        const serveStatic = this.config?.expose?.server?.serveStatic;

        if (serveStatic === 'nginx') {
            await this.nginxServer();
        }

        this.app.get('/playgroundRebuild', (req, res) => {
            if (this.config.expose.server.playground.enabled) {
                res.writeHead(200, this.headers);

                emitter.on('renderHTML', (data) => {
                    console.log(data);
                    res.write('data: refresh\n\n');
                });
            }
        });

        if (serveStatic === 'node') {
            this.app.use('/playground', express.static(paths.playground));
            this.app.get('/output/:path*', (req: any, res) => {
                res.sendFile(path.join(paths.output, req.params.path, req.params[0]));
            });
        }

        this.app.listen(port, () => {
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
