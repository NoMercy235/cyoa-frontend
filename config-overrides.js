const { addBabelPlugins, override } = require('customize-cra');

module.exports = override(
  ...addBabelPlugins(
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ),
);
