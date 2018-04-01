const Promise = require('bluebird')

/**
 * @param {reducer} reducer
 * @param {Function} callback
 * @param {Array} array
 * @return {*}
 */
function map (reducer, callback, array) {
  if (reducer.__sync__) {
    return array.map(callback)
  }

  return Promise.map(array, callback)
}

module.exports.map = map

/**
 * @param {reducer} reducer
 * @param {Function} callback
 * @param {Array} array
 * @return {*}
 */
function filter (reducer, callback, array) {
  if (reducer.__sync__) {
    return array.filter(callback)
  }

  return Promise.filter(array, callback)
}

module.exports.filter = filter

/**
 * @param {reducer} reducer
 * @param {Function} callback
 * @param {Array} array
 * @param {*} initialValue
 * @return {*}
 */
function reduce (reducer, callback, array, initialValue) {
  if (reducer.__sync__) {
    return array.reduce(callback, initialValue)
  }

  return Promise.reduce(array, callback, initialValue)
}

module.exports.reduce = reduce
