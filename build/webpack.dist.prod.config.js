const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const externals = require('./externals');
const uglifyPlugin = require('./uglifyPlugin');
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
        filename: 'iview.min.js',
        library: 'iview',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    externals: {
        vue: externals.vue,
    },
    plugins: [
        uglifyPlugin,
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
});
