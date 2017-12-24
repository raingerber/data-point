const Promise = require('bluebird')

const _resolver = (acc, fn) => fn(acc)

const _isDone = acc => false

/**
 * @param {boolean} chainResults - if true, use the result from each promise
 *                                 as the acc.value for the subsequent promise
 *                                 (similar to Array.reduce or Promise.reduce)
 * @returns {Function}
 */
const promiseArrayHelper = chainResults => {
  /**
   * @param {Array} reducers
   * @param {Function} resolve
   * @param {Function} isDone
   * @returns {Function}
   */
  return function reduce (reducers, { resolver, isDone }) {
    if (reducers.length === 0) {
      return Promise.resolve.bind(Promise)
    }

    if (typeof resolver !== 'function') {
      resolver = _resolver
    }

    if (typeof isDone !== 'function') {
      isDone = _isDone
    }

    let index = 0
    let accumulator

    const resolveNext = acc => {
      return resolver(acc, reducers[index]).then(acc => {
        if (isDone(acc, index) || ++index >= reducers.length) {
          return Promise.resolve(acc)
        }

        return resolveNext(chainResults ? acc : accumulator)
      })
    }

    return acc => {
      accumulator = acc
      return resolveNext(acc)
    }
  }
}

module.exports.map = promiseArrayHelper(false)

module.exports.reduce = promiseArrayHelper(true)
