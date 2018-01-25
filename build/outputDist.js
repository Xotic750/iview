const resolve = require('./resolve');

module.exports = {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: 'iview.min.js',
    library: 'iview',
    libraryTarget: 'umd',
    umdNamedDefine: true,
};
