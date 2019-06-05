const path = require('path')

// Core Deps required for packing
const HTMLPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

// Dev tools
const Visualizer = require('webpack-visualizer-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let config = {
    mode: isProduction ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        publicPath: '/dist/',
        filename: '[name]-bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {sourceMap: !isProduction},
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    'less-loader',
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HTMLPlugin({
            template: 'client/index.template.html',
            // Inject false turns off automatic injection of Css and JS
            inject: false,
        }),
    ],
    optimization: {},
}

if (isProduction) {
    config.plugins.push(
        new Visualizer({filename: '../stats.html'}),
    )
} else {
    config.devtool = 'cheap-module-eval-source-map'
}

module.exports = config
