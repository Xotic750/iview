const get = require('lodash/get');

module.exports = (ctx) => {
    return {
        plugins: {
            autoprefixer: Object.assign({}, get(ctx, 'options.autoprefixer')),
            cssnano: Object.assign({
                preset: 'default',
            }, get(ctx, 'options.cssnano')),
            'postcss-cssnext': Object.assign({}, get(ctx, 'options.cssnext')),
            'postcss-import': Object.assign(
                get(ctx, 'file.dirname') ?
                {
                    root: ctx.file.dirname,
                } :
                {},
                get(ctx, 'options.import')),
        },
    };
};
