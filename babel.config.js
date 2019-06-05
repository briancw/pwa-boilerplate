module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                modules: false,
            },
        ],
    ],
    sourceType: 'unambiguous',
    ignore: [/[/\\]core-js/, /@babel[/\\]runtime/],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
    ],
}
