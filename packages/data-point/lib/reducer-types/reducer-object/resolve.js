const set = require('lodash/set')

const { then } = require('../reducer-helpers/utils/then')
const { map } = require('../reducer-helpers/utils/array-functions')

/**
 * @param {Object} manager
 * @param {Function} resolveReducer
 * @param {Accumulator} accumulator
 * @param {ReducerObject} reducer
 * @return {*}
 */
function resolve (manager, resolveReducer, accumulator, reducer) {
  const result = {}
  if (reducer.reducers.length === 0) {
    return result
  }

  const sync = reducer.__sync__
  const callback = then(sync, ({ reducer, path }) => {
    const value = resolveReducer(manager, accumulator, reducer)
    return sync
      ? set(result, path, value)
      : value.then(v => set(result, path, v))
  })

  const p = map(reducer, callback, reducer.reducers)
  return sync ? result : p.then(() => result)
}

module.exports.resolve = resolve
