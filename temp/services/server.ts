import cmd from 'node-cmd';
import path from 'path';

import { projectName } from '../constants';
import state from '../state';
import { IClientConfig, IDistConfig } from '../types';
import { status } from '../utils';

class Server {
    private pluginsPath = path.join(__dirname, '../', 'server', 'index.js');

    constructor(config: IClientConfig | IDistConfig) {
        if (state.get('serverType') === 'distributor') {
            this.startDistServer(config as IDistConfig);
        }
    }

    private startDistServer(config: IDistConfig) {
        cmd.run(`pm2 start ${this.pluginsPath}`, async (err) => {
            if (err) {
                status.error('server error');
            }

            status.success(` 🚀 ${projectName} server started on port ${config.serverPort || 9000} 🚀 `.toUpperCase());
        });
    }
}

export default Server;
