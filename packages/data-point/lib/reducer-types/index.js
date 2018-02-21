/* eslint global-require: 0 */

module.exports = {
  create: require('./factory').create,
  createDebug: require('./factory').createDebug,
  isReducer: require('./factory').isReducer,
  resolve: require('./resolve').resolve
}
