const entry = require('./locale');
const externals = require('./externals');
const uglifyPlugin = require('./uglifyPlugin');
const resolve = require('./resolve');
const babel = require('./babel');
const eslint = require('./eslint');

process.env.NODE_ENV = 'production';

module.exports = {
    devtool: 'source-map',
    entry,
    module: {
        rules: [
            babel.rule,
            eslint.rule,
        ],
    },
    output: {
        path: resolve('dist/locale'),
        publicPath: '/dist/locale/',
        filename: '[name].js',
        library: 'iview/locale',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    externals: {
        vue: externals.vue,
    },
    plugins: [
        uglifyPlugin,
    ],
};
