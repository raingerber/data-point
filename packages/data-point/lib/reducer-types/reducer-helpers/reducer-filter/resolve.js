// TODO why do we have multiple utils directories
const utils = require('../../../utils')
const { then } = require('../utils/then')
const { filter } = require('../utils/array-functions')
const { reducerPredicateIsTruthy } = require('../utils')

/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerFilter} reducerFilter
 * @returns {Promise}
 */
function resolve (manager, resolveReducer, accumulator, reducerFilter) {
  const reducer = reducerFilter.reducer
  const callback = then(reducer.__sync__, value => {
    return reducerPredicateIsTruthy(reducer, value)
  })

  const predicate = itemValue => {
    const itemContext = utils.set(accumulator, 'value', itemValue)
    return callback(resolveReducer(manager, itemContext, reducer))
  }

  return filter(reducer, predicate, accumulator.value)
}

module.exports.resolve = resolve
