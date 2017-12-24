/* eslint-env jest */
'use strict'

const AccumulatorFactory = require('../../accumulator/factory')
const resolveObject = require('./resolve').resolve
const createTransform = require('../reducer-expression').create
const resolveTransform = require('../reducer-expression').resolve
const FixtureStore = require('../../../test/utils/fixture-store')

const ReducerFactory = transform => {
  return createTransform(transform).reducers[0]
}

let dataPoint

beforeAll(() => {
  dataPoint = FixtureStore.create()
})

describe('resolve#reducerObject.resolve', () => {
  it('should return the accumulator for an empty reducer object', () => {
    const reducer = ReducerFactory({})

    const accumulator = AccumulatorFactory.create({
      value: {
        x: {
          y: {
            z: 2
          }
        }
      }
    })

    return resolveObject(
      dataPoint,
      resolveTransform,
      accumulator,
      reducer
    ).then(result => {
      expect(result.value).toEqual(accumulator.value)
    })
  })

  it('should resolve a reducer object', () => {
    const reducer = ReducerFactory({
      y: '$x.y',
      zPlusOne: ['$x.y.z', acc => acc.value + 1]
    })

    const accumulator = AccumulatorFactory.create({
      value: {
        x: {
          y: {
            z: 2
          }
        }
      }
    })

    return resolveObject(
      dataPoint,
      resolveTransform,
      accumulator,
      reducer
    ).then(result => {
      expect(result.value).toEqual({
        y: {
          z: 2
        },
        zPlusOne: 3
      })
    })
  })

  it('should resolve a reducer object', () => {
    const reducer = ReducerFactory({
      x: '$c.x',
      y: '$c.y',
      z: {
        a: '$a',
        b: '$b'
      }
    })

    const accumulator = AccumulatorFactory.create({
      value: {
        a: 'A',
        b: 'B',
        c: {
          x: 'X',
          y: 'Y'
        }
      }
    })

    return resolveObject(
      dataPoint,
      resolveTransform,
      accumulator,
      reducer
    ).then(result => {
      expect(result.value).toEqual({
        x: 'X',
        y: 'Y',
        z: {
          a: 'A',
          b: 'B'
        }
      })
    })
  })

  it('should resolve a reducer object', () => {
    const reducer = ReducerFactory({
      x: [
        '$a',
        {
          a: '$a'
        }
      ],
      y: [
        {
          a: '$a'
        },
        '$a'
      ]
    })

    const accumulator = AccumulatorFactory.create({
      value: {
        a: {
          a: 1,
          b: 2
        }
      }
    })

    return resolveObject(
      dataPoint,
      resolveTransform,
      accumulator,
      reducer
    ).then(result => {
      expect(result.value).toEqual({
        x: {
          a: 1
        },
        y: {
          a: 1,
          b: 2
        }
      })
    })
  })
})
