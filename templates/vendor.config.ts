import { IConfig } from '.vendor/_utils/interfaces';

const config: IConfig = {
    platform: 'browser',
    expose: {
        port: process.env.VENDOR_PORT || 8888,
        minify: true,
        sourcemap: true,
        entries: [
            {
                version: 1,
                name: 'example',
                target: './example/index.ts',
                deps: [],
            },
        ],
    },
    remote: {
        port: process.env.VENDOR_PORT || 8889,
        host: 'http://localhost:3000',
        entries: [
            {
                version: 1,
                name: 'example',
            },
        ],
    },
};

export default config;
