const DEFAULT_EXCLUDE_RX = require('./defaultExcludes');

/**
 * Shared (.js & .vue) babel-loader options.
 * @type {!Object}
 * @see {@link https://github.com/babel/babel-loader}
 */
const loader = {
    exclude: DEFAULT_EXCLUDE_RX,
    loader: 'babel-loader',
    options: {
        plugins: ['lodash'],
        presets: [['env', {
            modules: false,
            targets: {
                node: 8,
            },
        }]],
    },
};

module.exports = {
    loader,
    rule: Object.assign({}, loader, {
        test: /\.js$/,
    }),
};
