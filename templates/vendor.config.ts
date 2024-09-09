import { IConfig } from '.vendor/_utils/interfaces';

const vendorConfig: IConfig = {
    expose: {
        declarationTypes: ['global.d.ts'],
        server: {
            enabled: true,
            port: 8888,
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
    remote: {
        publicPath: 'public',
        url: 'http://example',
        watch: true,
        entries: [{ name: 'example', version: 1 }],
    },
};

export default vendorConfig;
