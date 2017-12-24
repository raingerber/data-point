'use strict'

const Promise = require('bluebird')
const utils = require('../../utils')

/**
 * Resolve a ReducerFunction
 * @param {Accumulator} accumulator
 * @param {ReducerFunction} reducer
 * @returns {Promise<Accumulator>}
 */
function resolve (accumulator, reducer) {
  const callbackFunction = reducer.body

  if (callbackFunction.length === 2) {
    // if the arity is 2, we expect a Node Style
    // callback function with the form of (acc, done)
    return new Promise((resolve, reject) => {
      callbackFunction(accumulator, (err, value) => {
        if (err) {
          return reject(err)
        }
        resolve(utils.set(accumulator, 'value', value))
      })
    })
  }

  // callbackFunction is assumed to be either sync
  // or Promise returned value
  return Promise.try(() => callbackFunction(accumulator)).then(value => {
    return utils.set(accumulator, 'value', value)
  })
}

module.exports.resolve = resolve
