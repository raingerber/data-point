/* eslint-env jest */
'use strict'

const AccumulatorFactory = require('../../accumulator/factory')
const createTransform = require('../reducer-expression').create
const resolveFunction = require('./resolve')

const reducerFactory = source => {
  return createTransform(source).reducers[0]
}

describe('resolve#filter.resolve', () => {
  test('resolves node style callback', () => {
    const accumulator = AccumulatorFactory.create({
      value: 'test'
    })

    const reducer = reducerFactory((acc, done) =>
      done(null, `${acc.value}node`)
    )

    return resolveFunction.resolve(accumulator, reducer).then(result => {
      expect(result.value).toBe('testnode')
    })
  })

  test('resolves a sync function', () => {
    const accumulator = AccumulatorFactory.create({
      value: 'test'
    })

    const reducer = reducerFactory(acc => `${acc.value}sync`)

    return resolveFunction.resolve(accumulator, reducer).then(result => {
      expect(result.value).toBe('testsync')
    })
  })

  test('resolves a promise function', () => {
    const accumulator = AccumulatorFactory.create({
      value: 'test'
    })

    const reducer = reducerFactory(acc =>
      Promise.resolve(`${acc.value}promise`)
    )

    return resolveFunction.resolve(accumulator, reducer).then(result => {
      expect(result.value).toBe('testpromise')
    })
  })

  test('rejects if callback passes error as first param', () => {
    const accumulator = AccumulatorFactory.create({
      value: 'test'
    })

    const reducer = reducerFactory((acc, done) => {
      return done(new Error('Test'))
    })

    return resolveFunction
      .resolve(accumulator, reducer)
      .catch(err => err)
      .then(err => {
        expect(err).toHaveProperty('message', 'Test')
      })
  })
})
