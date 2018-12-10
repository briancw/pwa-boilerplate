const base = require('./webpack.base.config')

const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')

const config = Object.assign({}, base, {
    // This allows webpack to handle dynamic imports in a Node-appropriate
    // fashion, and also tells `vue-loader` to emit server-oriented code when
    // compiling Vue components.
    target: 'node',
    // Point entry to your app's server entry file
    entry: './client/entry_server.js',
    // This tells the server bundle to use Node-style exports
    output: Object.assign({}, base.output, {
        libraryTarget: 'commonjs2',
    }),
    // https://github.com/liady/webpack-node-externals
    // Externalize app dependencies. This makes the server build much faster and generates a smaller bundle file.
    // Do not externalize dependencies that need to be processed by webpack.
    // You can add more file types here e.g. raw *.vue files.
    // You should also whitelist deps that modifies `global` (e.g. polyfills).
    externals: [
        ...Object.keys(require('../package.json').dependencies),
    ],
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"',
        }),
        // This is the plugin that turns the entire output of the server build
        // into a single JSON file. The default file name will be
        // `vue-ssr-server-bundle.json`
        new VueSSRServerPlugin(),
        new WebpackBuildNotifierPlugin({
            title: 'Webpack Server Build',
            suppressSuccess: true,
        }),
    ]),
})

module.exports = config
