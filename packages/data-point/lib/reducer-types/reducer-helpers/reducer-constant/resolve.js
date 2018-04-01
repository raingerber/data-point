/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerConstant} reducerConstant
 * @returns {*}
 */
function resolve (manager, resolveReducer, accumulator, reducerConstant) {
  return reducerConstant.value
}

module.exports.resolve = resolve
