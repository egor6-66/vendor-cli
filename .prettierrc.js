module.exports = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    endOfLine: 'auto',
    overrides: [
        {
            endOfLine: 'auto',
            files: ['*.ts'],
            options: {
                printWidth: 160,
            },
        },
    ],
};
