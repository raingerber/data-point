const { then } = require('../utils/then')
const { map } = require('../utils/array-functions')

/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerParallel} reducerParallel
 * @returns {Promise}
 */
function resolve (manager, resolveReducer, accumulator, reducerParallel) {
  const callback = then(reducerParallel.__sync__, reducer => {
    return resolveReducer(manager, accumulator, reducer)
  })

  return map(reducerParallel, callback, reducerParallel.reducers)
}

module.exports.resolve = resolve
