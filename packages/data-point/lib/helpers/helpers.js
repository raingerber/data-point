'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const resolveTransform = require('../reducer-types').resolve
const AccumulatorFactory = require('../accumulator/factory')

function reducify (method) {
  return function () {
    const partialArguments = Array.prototype.slice.call(arguments)
    return function (acc, done) {
      const methodArguments = [acc.value].concat(partialArguments)
      const result = method.apply(null, methodArguments)
      if (_.isError(result)) {
        return done(result)
      }
      done(null, result)
    }
  }
}

module.exports.reducify = reducify

function reducifyAll (source, methodList) {
  let target = source
  if (!_.isEmpty(methodList)) {
    target = _.pick(source, methodList)
  }
  return _.mapValues(target, reducify)
}

module.exports.reducifyAll = reducifyAll

function mockReducer (reducer, acc) {
  const pcb = Promise.promisify(reducer)
  return pcb(acc).then(val => ({ value: val }))
}

module.exports.mockReducer = mockReducer

const createTransform = require('../reducer-types').create

module.exports.createTransform = createTransform

function createAccumulator (value, options) {
  return AccumulatorFactory.create(
    Object.assign(
      {
        value
      },
      options
    )
  )
}

module.exports.createAccumulator = createAccumulator

function createResolveTransform (dataPoint) {
  return resolveTransform.bind(null, dataPoint)
}

module.exports.createResolveTransform = createResolveTransform

// TODO get rid of this
function isTransform (transform) {
  return _.isArray(transform.reducers) && transform.type === 'ReducerExpression'
}

module.exports.isTransform = isTransform
