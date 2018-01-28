module.exports = (ctx) => ({
    plugins: {
        autoprefixer: Object.assign({}, ctx.options.autoprefixer),
        cssnano: Object.assign({
            preset: 'default',
        }, ctx.options.cssnano),
        'postcss-cssnext': Object.assign({}, ctx.options.cssnext),
        'postcss-import': Object.assign({
            root: ctx.file.dirname,
        }, ctx.options.import),
    },
});
