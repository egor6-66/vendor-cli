import { IConfig } from '.vendor/_utils/interfaces';

const config: IConfig = {
    platform: 'browser',
    expose: {
        entries: [
            {
                version: 1,
                name: 'example',
                target: './example/index.ts',
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
