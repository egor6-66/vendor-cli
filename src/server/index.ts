import path from 'path';

const http = require('http');
import { Config } from '../interfaces';
import { cmd, paths } from '../utils';

const config = require(paths.compiledConfig) as Config.IConfig;

interface IArgs {
    port: number;
}

(() => {
    const args = cmd.getArgs() as IArgs;

    const server = http.createServer(function (request: any, response: any) {
        response.end('Hello METANIT.COM!');
    });

    server.listen(args, function () {
        console.log('Сервер запущен по адресу http://localhost:3000');
    });
})();
