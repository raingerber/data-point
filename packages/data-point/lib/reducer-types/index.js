/* eslint global-require: 0 */

module.exports = {
  create: require('./factory').create,
  getCreate: require('./factory').getCreate,
  isReducer: require('./factory').isReducer,
  resolve: require('./resolve').resolve
}
