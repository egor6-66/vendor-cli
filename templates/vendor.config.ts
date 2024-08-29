module.exports = {
    platform: 'browser' | 'node',
    zipPass: process.env.ZIP_PASS,
    exposes: {
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
    remotes: {
        host: process.env.REMOTE_HOST,
        entries: [
            {
                version: 1,
                name: 'example',
            },
        ],
    },
};
