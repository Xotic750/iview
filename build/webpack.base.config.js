/**
 * 公共配置
 */
const path = require('path');
const webpack = require('webpack');
const packageJSON = require('../package.json');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

/**
 * The iView version string.
 * @type {string}
 */
const VERSION = `'${packageJSON.version}'`;

/**
 * The default exclude regex.
 * @type {string}
 */
const DEFAULT_EXCLUDE_RX = /node_modules/;

/**
 * If the file is greater than the limit (in bytes) the file-loader is used by default
 * and all query parameters are passed to it..
 *
 * @type {number}
 * @see {@link https://github.com/webpack-contrib/url-loader#limit}
 */
const URL_LOADER_BYTES_LIMIT = 8192;

const BUILD_SOURCEMAPS = true;

/**
 * Shared (.js & .vue) babel-loader options.
 * @type {!Object}
 * @see {@link https://github.com/babel/babel-loader}
 */
const babelLoader = {
    exclude: DEFAULT_EXCLUDE_RX,
    loader: 'babel-loader',
};

/**
 * Adds CSS to the DOM by injecting a <style> tag.
 * @type {!Object}
 * @see {@link https://webpack.js.org/loaders/style-loader/}
 */
const styleLoader = {
    loader: 'style-loader',
    options: {
        singleton: true,
        sourceMap: BUILD_SOURCEMAPS,
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
        sourceMap: BUILD_SOURCEMAPS,
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
        sourceMap: BUILD_SOURCEMAPS,
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
        sourceMap: BUILD_SOURCEMAPS,
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
        sourceMap: BUILD_SOURCEMAPS,
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
                    cssSourceMap: BUILD_SOURCEMAPS,
                    // https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md#loaders
                    loaders: {
                        css: generateLoaders(postcssLoader),
                        js: [babelLoader],
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
            Object.assign({}, babelLoader, {
                test: /\.js$/,
            }),
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
                    limit: URL_LOADER_BYTES_LIMIT,
                },
            },
            // Exports HTML as string. HTML is minimized when the compiler demands.
            // https://github.com/webpack-contrib/html-loader
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader',
            },
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
            'process.env.VERSION': VERSION,
        }),
    ],
};
