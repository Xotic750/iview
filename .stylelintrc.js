module.exports = {
  /**
   * The standard shareable config for stylelint.
   * @type {string|array.<string>}
   * @see {@link https://github.com/stylelint/stylelint-config-standard|standard}
   */
  extends: 'stylelint-config-standard',

  /**
   * @type {array}
   */
  plugins: [],

  /**
   * @type {array}
   */
  processors: [],

  /**
   * @type {!Object}
   */
  rules: {
    "indentation": 4,
    // 'no-empty-source': null,
  },
};
