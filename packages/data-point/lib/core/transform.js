'use strict'

const _ = require('lodash')
const Promise = require('bluebird')

const AccumulatorFactory = require('../accumulator/factory')
const ReducerExpression = require('../reducer-types')

function getOptions (spec) {
  return _.defaults({}, spec, {
    locals: {}
  })
}

function resolve (manager, transformSource, value, options) {
  const contextOptions = getOptions(options)
  const context = AccumulatorFactory.create({
    value: value,
    locals: contextOptions.locals,
    trace: contextOptions.trace,
    values: manager.values.getStore()
  })

  const transform = ReducerExpression.create(transformSource)

  return ReducerExpression.resolve(manager, context, transform)
}

function transform (manager, transformSource, value, options, done) {
  return Promise.resolve()
    .then(() => resolve(manager, transformSource, value, options))
    .asCallback(done)
}

module.exports = transform
