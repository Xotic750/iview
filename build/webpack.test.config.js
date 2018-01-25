/**
 * 用于单元测试
 */

const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');

process.env.NODE_ENV = 'testing';

const webpackConfig = merge(webpackBaseConfig, {
    // use inline sourcemap for karma-sourcemap-loader
    devtool: 'inline-source-map',
});

// no need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;
