module.exports = {
    ident: 'postcss',
    plugins: [
        require('autoprefixer')(),
    ],
    sourceMap: true,
    syntax: require.resolve('postcss-less'),
}
