module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['simple-import-sort', 'promise', 'sonarjs', 'unicorn'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: [
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
        'plugin:promise/recommended',
        'plugin:sonarjs/recommended-legacy',
    ],
    overrides: [
        {
            files: ['*.js', '*.ts', '*'],
            rules: {
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            ['^react', '^@?\\w'],
                            ['^(@|components)(/.*|$)'],
                            ['^\\u0000'],
                            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                            ['^.+\\.?(css)$'],
                        ],
                    },
                ],
            },
        },
    ],

    rules: {
        'no-case-declarations': 0,
        'sonarjs/no-nested-switch': 0,
        'promise/no-nesting': 0,
        '@typescript-eslint/no-var-requires': 0,
        'promise/catch-or-return': 0,
        'promise/always-return': 0,
        '@typescript-eslint/consistent-type-definitions': 'error',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'no-undef': 0,
        'no-unused-vars': 0,
        'sonarjs/no-collapsible-if': 0,
        'sonarjs/no-identical-expressions': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'sonarjs/no-small-switch': 0,
        'sonarjs/no-identical-functions': 0,
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: true,
                },
            },
        ],
        'lines-between-class-members': ['error', 'always'],
        'padding-line-between-statements': [
            'warn',
            { blankLine: 'always', prev: '*', next: 'block' },
            { blankLine: 'always', prev: 'block', next: '*' },
            { blankLine: 'always', prev: '*', next: 'block-like' },
            { blankLine: 'always', prev: 'block-like', next: '*' },
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: 'directive', next: '*' },
            { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
            { blankLine: 'always', prev: 'multiline-const', next: '*' },
            { blankLine: 'always', prev: '*', next: 'multiline-const' },
            { blankLine: 'always', prev: 'import', next: '*' },
            {
                blankLine: 'any',
                prev: ['singleline-const', 'singleline-let'],
                next: ['singleline-const', 'singleline-let'],
            },
            { blankLine: 'always', prev: ['case', 'default'], next: '*' },
            { blankLine: 'always', prev: '*', next: 'export' },
            {
                blankLine: 'any',
                prev: ['export'],
                next: ['export'],
            },
            {
                blankLine: 'any',
                prev: ['import'],
                next: ['import'],
            },
        ],
    },
};
