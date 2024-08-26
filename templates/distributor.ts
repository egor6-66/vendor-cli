module.exports = {
    type: 'distributor',
    entries: [
        {
            version: 1,
            name: 'example',
            exposes: {
                './example': './src/example.ts',
            },
            shared: [],
        },
    ],
};
