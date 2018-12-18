const { injectBabelPlugin, compose } = require('react-app-rewired');

function rewireDecorators(config) {
  return injectBabelPlugin(['@babel/plugin-proposal-decorators', { legacy: true }], config);
}

function rewireClassFields(config) {
  return injectBabelPlugin(['@babel/plugin-proposal-class-properties', { loose: true }], config);
}

module.exports = compose(
  rewireDecorators,
  rewireClassFields,
);
