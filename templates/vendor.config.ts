import { IConfig } from '.vendor/_utils/interfaces';

const config: IConfig = {
    expose: {
        server: {
            disabled: false,
            port: 8888,
            server: 'node',
            playground: {
                disabled: false,
                root: 'src/index.tsx',
                config: {
                    platform: 'browser',
                    packages: 'bundle',
                },
            },
        },
        entries: [
            {
                version: 1,
                name: 'example',
                target: 'src/example/index.ts',
                watch: false,
                config: {
                    platform: 'browser',
                    packages: 'external',
                },
            },
        ],
    },
};

export default config;
