const path = require('path');
const webpack = require('webpack');
const entry = require('./locale');
process.env.NODE_ENV = 'production';

const BUILD_SOURCEMAPS = true;

module.exports = {
    devtool: 'nosources-source-map',
    entry,
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist/locale'),
        publicPath: '/dist/locale/',
        filename: '[name].js',
        library: 'iview/locale',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            sourceMap: BUILD_SOURCEMAPS,
            uglifyOptions: {
                ecma: 8,
            },
        })
    ]
};
