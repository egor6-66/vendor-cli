import path from 'path';

import { Config } from '../interfaces';
import { cmd, paths } from '../utils';

const config = require(paths.compiledConfig) as Config.IConfig;

interface IArgs {
    port: number;
}

async function bootstrap() {}

bootstrap();
