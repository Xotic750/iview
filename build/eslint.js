const DEFAULT_EXCLUDE_RX = require('./defaultExcludes');

/**
 * Shared (.js & .vue) eslint-loader options.
 * @type {!Object}
 * @see {@link https://github.com/MoOx/eslint-loader}
 */
const loader = {
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
        emitError: true,
        emitWarning: false,
        failOnError: true,
        failOnWarning: false,
        quiet: true,
    },
};

module.exports = {
    loader,
    rule: Object.assign(loader, {
        exclude: DEFAULT_EXCLUDE_RX,
        test: /\.(js|jsx|json|vue)$/,
    }),
};
