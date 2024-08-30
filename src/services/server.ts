import cmd from 'node-cmd';
import path from 'path';

import { IBuildArgs } from '../types';
import { status } from '../utils';

class Server {
    args!: IBuildArgs;

    constructor(args: IBuildArgs) {
        this.args = args;

        if (this.args.serverstatic) {
            this.serverstatic();
        }
    }

    serverstatic() {
        const port = this.args.port || 8888;
        const serverPath = path.join(__dirname, '../', 'server', 'index.js');
        status.success(`🚀Static server started on PORT ${port}🚀 `);
        cmd.runSync(`${this.args.pm2 ? 'pm2 start' : 'ts-node'} ${serverPath} -- --port=${port}`);
    }
}

export default Server;
