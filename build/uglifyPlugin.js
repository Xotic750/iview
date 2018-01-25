const webpack = require('webpack');

module.exports = new webpack.optimize.UglifyJsPlugin({
    parallel: true,
    sourceMap: true,
    uglifyOptions: {
        ecma: 8,
    },
});
