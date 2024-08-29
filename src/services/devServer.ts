import express from 'express';
import path from 'path';

import { inputJsPath } from '../constants';
import { IConfig } from '../types';

class DevServer {
    constructor(config: IConfig) {
        this.startServer(config);
    }

    startServer(config: IConfig) {
        console.log('start server', config);
        const app = express();
        app.get(`/entries/:name`, (req, res) => {
            res.sendFile(path.join(inputJsPath, 'js', 'button.js'));
        });

        app.listen(9000);
    }
}

export default DevServer;
