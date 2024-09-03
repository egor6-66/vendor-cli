import { IConfig } from '.vendor/_utils/interfaces';

const config: IConfig = {
    expose: {
        server: {
            enabled: true,
            port: 8888,
            server: 'node',
            playground: {
                enabled: true,
                root: 'src/index.tsx',
                htmlPath: 'public/index.html',
            },
        },
        entries: [
            {
                version: 1,
                name: 'example',
                target: 'src/example/index.ts',
                watch: true,
                checkTypes: true,
            },
        ],
    },
};

export default config;
