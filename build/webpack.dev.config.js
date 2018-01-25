/**
 * 本地预览
 */

const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const resolve = require('./resolve');

process.env.NODE_ENV = 'development';

module.exports = merge(webpackBaseConfig, {
    // 入口
    entry: {
        main: './examples/main',
        vendors: ['vue', 'vue-router'],
    },
    // 输出
    output: {
        path: resolve('examples/dist'),
        publicPath: '',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },
    resolve: {
        alias: {
            iview: '../../src/index',
        },
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendor.bundle.js',
        }),
        new HtmlWebpackPlugin({
            inject: true,
            filename: resolve('examples/dist/index.html'),
            template: resolve('examples/index.html'),
        }),
        new FriendlyErrorsPlugin(),
    ],
});
