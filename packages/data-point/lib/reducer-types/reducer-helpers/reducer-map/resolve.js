const utils = require('../../../utils')
const { then } = require('../utils/then')
const { map } = require('../utils/array-functions')

/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerMap} reducerMap
 * @returns {Promise}
 */
function resolve (manager, resolveReducer, accumulator, reducerMap) {
  const reducer = reducerMap.reducer
  const callback = then(reducer.__sync__, itemValue => {
    const itemContext = utils.set(accumulator, 'value', itemValue)
    return resolveReducer(manager, itemContext, reducer)
  })

  return map(reducer, callback, accumulator.value)
}

module.exports.resolve = resolve
