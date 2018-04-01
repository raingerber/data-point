const Promise = require('bluebird')
const set = require('lodash/set')

/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerObject} reducer
 * @returns {Promise}
 */
function resolve (manager, resolveReducer, accumulator, reducer) {
  const result = reducer.source()
  if (reducer.reducers.length === 0) {
    return result
  }

  // console.log('obj:', !!reducer.__sync__)
  if (reducer.__sync__) {
    return reducer.reducers.reduce((acc, { reducer, path }) => {
      const value = resolveReducer(manager, accumulator, reducer)
      return set(acc, path, value)
    }, result)
  }

  return Promise.map(reducer.reducers, ({ reducer, path }) => {
    return resolveReducer(manager, accumulator, reducer).then(value => {
      set(result, path, value)
    })
  }).then(() => result)
}

module.exports.resolve = resolve
