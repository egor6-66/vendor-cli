import path from 'path';

import { Config } from '../interfaces';
import { cmd, message, paths } from '../utils';

class Server {
    config!: Config.IConfig;

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

    async nodeServer() {
        console.log('node');
    }

    async nginxServer() {
        await cmd.exec(`docker compose -f ${path.join(paths.docker, 'docker-compose.yml')} up --build -d`, ({ error, stdout }) => {
            error ? message('error', error) : message('info', stdout);
        });
        message('success', '🚀NGINX server started🚀');
    }
}

export default Server;
