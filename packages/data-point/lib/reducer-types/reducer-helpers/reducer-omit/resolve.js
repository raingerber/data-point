const omit = require('lodash/omit')

/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerOmit} reducerOmit
 * @returns {Object}
 */
function resolve (manager, resolveReducer, accumulator, reducerOmit) {
  return omit(accumulator.value, reducerOmit.keys)
}

module.exports.resolve = resolve
