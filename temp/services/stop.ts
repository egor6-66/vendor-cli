import cmd from 'node-cmd';
import path from 'path';

import { projectName } from '../constants';
import { status } from '../utils';

class Stop {
    private serverPath = path.join(__dirname, '../', 'server', 'index.js');

    constructor() {
        this.stopServer();
    }

    stopServer() {
        cmd.run(`pm2 stop ${this.serverPath}`, async () => {
            status.warning(`${projectName} server stopped`.toUpperCase());
        });
    }
}

export default Stop;
