/* eslint-env jest */
'use strict'

const factory = require('./factory')
const createTransform = require('../reducer-expression').create

test('reducer/reducer-function#isObject', () => {
  expect(factory.isObject('$foo')).toBe(false)
  expect(factory.isObject(() => true)).toBe(false)
  expect(factory.isObject([])).toBe(false)
  expect(factory.isObject({})).toBe(true)
})

describe('reducer/reducer-function#getReducerProps', () => {
  it('should accept an empty object', () => {
    const reducer = factory.getReducerProps(createTransform, {})
    expect(reducer).toEqual([])
  })
  it('should accept a non-empty object', () => {
    const reducer = factory.getReducerProps(createTransform, {
      a1: '$a[]',
      b1: {
        a2: ['$a2', () => false],
        b2: [
          {
            a3: 'transform:entity-name',
            b3: '$b1.b2.b3'
          }
        ]
      }
    })
    expect(reducer).toMatchSnapshot()
  })
})

describe('reducer/reducer-path#create', () => {
  it('reducer object with no props argument', () => {
    const reducer = factory.create(createTransform)
    expect(reducer.type).toBe('ReducerObject')
    expect(reducer.props).toBeInstanceOf(Array)
  })
  it('reducer object with empty props argument', () => {
    const reducer = factory.create(createTransform, {})
    expect(reducer.type).toBe('ReducerObject')
    expect(reducer.props).toBeInstanceOf(Array)
  })
  it('reducer object with props argument', () => {
    const reducer = factory.create(createTransform, {
      a: '$a',
      b: '$b',
      c: '$c'
    })
    expect(reducer.type).toBe('ReducerObject')
    expect(reducer.props).toBeInstanceOf(Array)
    expect(reducer.props).toHaveLength(3)
  })
})
