const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const externals = require('./externals');
const resolve = require('./resolve');

process.env.NODE_ENV = 'production';

module.exports = merge(webpackBaseConfig, {
    devtool: 'source-map',
    entry: {
        main: resolve('src/index.js'),
    },
    output: {
        path: resolve('dist'),
        publicPath: '/dist/',
        filename: 'iview.js',
        library: 'iview',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        vue: externals.vue,
    },
});
