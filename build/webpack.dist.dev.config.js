const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const externals = require('./externals');
const outputDist = require('./outputDist');

process.env.NODE_ENV = 'production';

module.exports = merge(webpackBaseConfig, {
    devtool: 'source-map',
    entry: {
        main: './src/index.js',
    },
    output: outputDist,
    externals: {
        vue: externals.vue,
    },
});
