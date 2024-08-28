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
                targets: {
                    example: './temp/example.ts',
                },
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
