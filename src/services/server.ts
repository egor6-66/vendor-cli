import cmd from 'node-cmd';
import path from 'path';

import { IClientServerProps, IStaticServerProps } from '../types';
import { status } from '../utils';

class Server {
    staticServer(props: IStaticServerProps) {
        const port = props.port || 8888;
        const serverPath = path.join(__dirname, '../', 'server', 'staticServer.js');
        status.success(`🚀Static server started on PORT ${port}🚀 `);
        cmd.runSync(`${props.pm2 ? 'pm2 start' : 'ts-node'} ${serverPath} -- --port=${port}`);
    }

    clientServer(props: IClientServerProps) {
        const port = props.port || 8889;
        const serverPath = path.join(__dirname, '../', 'server', 'clientServer.js');
        // status.success(`🚀Static server started on PORT ${port}🚀 `);
        cmd.runSync(`ts-node ${serverPath} -- --port=${port}`);
    }
}

export default new Server();
