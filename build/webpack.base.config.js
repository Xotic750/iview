/**
 * 公共配置
 */

const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const {
    BundleAnalyzerPlugin,
} = require('webpack-bundle-analyzer');
const packageJSON = require('../package.json');
const resolve = require('./resolve');
const babel = require('./babel');
const eslint = require('./eslint');

const PERFORM_LINTING = false;

const RUN_REPORT = false;

/**
 * A webpack plugin to lint your CSS/Sass code using stylelint.
 * @type {!Object}
 * @see {@link https://github.com/JaKXz/stylelint-webpack-plugin}
 */

const styleLint = new StyleLintPlugin({
    emitErrors: true,
    failOnError: false, // https://github.com/JaKXz/stylelint-webpack-plugin/issues/103
    files: ['**/*.+(css|sass|scss|less|vue)'],
    quiet: true, // https://github.com/JaKXz/stylelint-webpack-plugin/issues/61
});

/**
 * Adds CSS to the DOM by injecting a <style> tag.
 * @type {!Object}
 * @see {@link https://webpack.js.org/loaders/style-loader/}
 */
const styleLoader = {
    loader: 'style-loader',
    options: {
        singleton: true,
        sourceMap: true,
    },
};

/**
 * The css-loader interprets @import and url() like import/require() and will resolve them.
 * @type {!Object}
 * @see {@link https://webpack.js.org/loaders/css-loader/}
 */
const cssLoader = {
    loader: 'css-loader',
    options: {
        camelCase: true,
        sourceMap: true,
    },
};

/**
 * Compiles Less to CSS.
 * @type {!Object}
 * @see {@link https://webpack.js.org/loaders/less-loader/}
 *
 * Usually, it's recommended to extract the style sheets into a dedicated file in
 * production using the ExtractTextPlugin. This way your styles are not dependent
 * on JavaScript.
 *
 * Uses webpack's resolver by default.
 * @see {@link https://webpack.js.org/loaders/less-loader/#webpack-resolver}
 */
const lessLoader = {
    loader: 'less-loader',
    options: {
        sourceMap: true,
    },
};

/**
 * Loader for webpack to process CSS with PostCSS.
 * @type {!Object}
 * @see {https://github.com/postcss/postcss-loader}
 */
const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
    },
};

/**
 * Loads a SASS/SCSS file and compiles it to CSS.
 * @type {!Object}
 * @see {@link https://github.com/webpack-contrib/sass-loader}
 */
const sassLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: true,
    },
};

/**
 * Generate style loaders for 'vue-loader'.
 *
 * @param {string} loader - The loader prefix.
 * @returns {Array} A new array with the required loaders.
 */
const generateLoaders = (loader) => {
    const loaders = [cssLoader];

    if (loader) {
        loaders.push(loader);
    }

    return ['vue-style-loader', ...loaders];
};

module.exports = {
    context: resolve(''),
    devtool: 'eval-source-map',
    /**
     * webpack can compile for multiple environments or targets.
     * @type {string}
     * @see {@link https://webpack.js.org/configuration/target/}
     */
    target: 'web',
    // 加载器
    module: {
        // https://doc.webpack-china.org/guides/migrating/#module-loaders-module-rules
        rules: [
            // https://vue-loader.vuejs.org/en/
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#csssourcemap
                    cssSourceMap: true,
                    // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#loaders
                    loaders: {
                        css: generateLoaders(postcssLoader),
                        js: [babel.loader, eslint.loader],
                        less: generateLoaders(lessLoader),
                        sass: generateLoaders(sassLoader),
                    },
                    postLoaders: {
                        html: 'babel-loader',
                    },
                    // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#transformtorequire
                    transformToRequire: {
                        image: 'xlink:href',
                        img: 'src',
                        source: 'src',
                        video: ['src', 'poster'],
                    },
                },
            },
            babel.rule,
            {
                test: /\.css$/,
                loaders: [
                    styleLoader,
                    cssLoader,
                    postcssLoader,
                ],
            },
            {
                test: /\.less$/,
                loaders: [
                    styleLoader,
                    cssLoader,
                    lessLoader,
                ],
            },
            {
                test: /\.scss$/,
                loaders: [
                    styleLoader,
                    cssLoader,
                    sassLoader,
                ],
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            // Exports HTML as string. HTML is minimized when the compiler demands.
            // https://github.com/webpack-contrib/html-loader
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader',
            },
            eslint.rule,
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.vue'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        },
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.VERSION': JSON.stringify(`'${packageJSON.version}'`),
        }),
        /**
         * Smaller lodash builds. We are not opting in to any features.
         * @type {!Object}
         * @see {@link https://github.com/lodash/lodash-webpack-plugin}
         */
        new LodashModuleReplacementPlugin({}),
        ...(RUN_REPORT ? [new BundleAnalyzerPlugin()] : []),
        ...(PERFORM_LINTING ? [styleLint] : []),
    ],
};
