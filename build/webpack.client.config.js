const base = require('./webpack.base.config.js')

const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')

const isProduction = process.env.NODE_ENV === 'production'

const config = Object.assign({}, base, {
    entry: {
        app: './client/entry_client.js',
    },
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
        }),
        // This plugins generates `vue-ssr-client-manifest.json` in the output directory.
        new VueSSRClientPlugin(),
        new WebpackBuildNotifierPlugin({
            title: 'Webpack Client Build',
            suppressSuccess: true,
        }),
    ]),
})

if (isProduction) {
    // This automatically takes care of vendor splitting
    config.optimization.splitChunks = {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                chunks: 'initial',
                name: 'vendor',
                enforce: true,
            },
        },
    }

    config.plugins.push(
        // Compress all JS and CSS files with Gzip and Brotli
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.css$/,
            threshold: 0,
            minRatio: 0.8,
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$/,
            threshold: 0,
            // minRatio: 0.8,
        }),
        // Generate a service worker to do local caching
        // It'd be best to read options for this and cater to specific project needs
        // https://www.npmjs.com/package/sw-precache-webpack-plugin
        new SWPrecacheWebpackPlugin({
            filename: 'service-worker.js',
            // staticFileGlobs: ['dist/**/*.{js,html,css}'],
            // minify: true,
            // stripPrefix: 'dist/',
            runtimeCaching: [{
                urlPattern: '/*',
                handler: 'networkFirst',
            }],
            staticFileGlobs: [
                'dist/**.css',
                'dist/img/**.*',
                'dist/**.js',
            ],
            // Don't allow the service worker to try to cache google analytics or your tracking will stop working
            // Disable any other scripts you don't want cached here as well
            staticFileGlobsIgnorePatterns: [/google-analytics.com/],
        })
    )
}

module.exports = config
