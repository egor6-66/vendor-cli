import express from 'express';
import path from 'path';

import { IConfig } from '../interfaces';
import { constants, message, paths } from '../utils';

class Server {
    config!: IConfig;

    app = express();

    headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
    };

    constructor(config: IConfig) {
        if (config) {
            this.config = config;
            this.startServer();
        }
    }

    async startServer() {
        try {
            const port = this.config?.expose?.server?.port || constants.ports.server;
            const wsPort = this.config?.expose?.server.wsPort || constants.ports.ws;

            const remoteConfig = {
                wsPort: wsPort,
            };

            this.app.get('/remoteConfig', (req: any, res) => {
                res.send(remoteConfig);
            });

            this.app.use('/playground', express.static(paths.playground));
            this.app.get('/output/:path*', (req: any, res) => {
                res.set(this.headers);
                res.appendHeader('Cache-Control', 'no-cache');
                res.sendFile(path.join(paths.output, req.params.path, req.params[0]));
            });

            this.app.listen(port, () => {
                message('success', `🚀NODE server started on port ${port}🚀`);
            });
        } catch (e) {
            console.log(e);
        }
    }
}

export default Server;
