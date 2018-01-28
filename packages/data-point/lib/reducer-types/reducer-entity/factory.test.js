/* eslint-env jest */

const factory = require('./factory')
const createReducer = require('../index').create

test('reducer/reducer-entity#isType', () => {
  expect(factory.isType('a')).toBe(false)
  expect(factory.isType('ab')).toBe(false)
  expect(factory.isType('#ab')).toBe(false)
  expect(factory.isType('abc')).toBe(false)
  expect(factory.isType('ab:')).toBe(false)
  expect(factory.isType(':ab')).toBe(false)
  expect(factory.isType('$a:abc')).toBe(false)
  expect(factory.isType('a-bc:abc')).toBe(false)
  expect(factory.isType('a:abc')).toBe(true)
  expect(factory.isType('abc:a')).toBe(true)
  expect(factory.isType('abc:abc')).toBe(true)
  expect(factory.isType('?abc:abc')).toBe(true)
  expect(factory.isType('abc:ab-c-')).toBe(true)
  expect(factory.isType('_abc:abc')).toBe(true)
  expect(factory.isType('#abc:abc')).toBe(true)
  expect(factory.isType('abc:abc[]')).toBe(true)
  expect(factory.isType('abc:abc[][]')).toBe(false)
  expect(factory.isType('abc:abc[]d')).toBe(false)
})

describe('create', function () {
  test('default create', () => {
    const reducer = factory.create(createReducer, 'foo:abc')
    expect(reducer.hasEmptyConditional).toBe(false)
    expect(reducer.type).toBe('ReducerEntity')
    expect(reducer.id).toBe('foo:abc')
    expect(reducer.entityType).toBe('foo')
    expect(reducer.name).toBe('abc')
  })

  test('with map', () => {
    const reducer = factory.create(createReducer, 'foo:abc[]')
    expect(reducer.type).toBe('ReducerMap')
    expect(reducer.reducer.hasEmptyConditional).toBe(false)
    expect(reducer.reducer.type).toBe('ReducerEntity')
    expect(reducer.reducer.id).toBe('foo:abc')
    expect(reducer.reducer.entityType).toBe('foo')
    expect(reducer.reducer.name).toBe('abc')
  })

  test('with conditional', () => {
    const reducer = factory.create(createReducer, '?foo:abc')
    expect(reducer.hasEmptyConditional).toBe(true)
    expect(reducer.type).toBe('ReducerEntity')
    expect(reducer.id).toBe('foo:abc')
    expect(reducer.entityType).toBe('foo')
    expect(reducer.name).toBe('abc')
  })

  test('with conditional and with map', () => {
    const reducer = factory.create(createReducer, '?foo:abc[]')
    expect(reducer.type).toBe('ReducerMap')
    expect(reducer.reducer.hasEmptyConditional).toBe(true)
    expect(reducer.reducer.type).toBe('ReducerEntity')
    expect(reducer.reducer.name).toBe('abc')
    expect(reducer.reducer.entityType).toBe('foo')
  })
})
