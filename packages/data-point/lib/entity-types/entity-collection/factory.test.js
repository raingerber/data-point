/* eslint-env jest */
'use strict'

const modelFactory = require('./factory')

test('modelFactory#create default', () => {
  const result = modelFactory.create({})

  expect(result.error).toHaveProperty('type', 'ReducerExpression')
  expect(result.before).toHaveProperty('type', 'ReducerExpression')
  expect(result.after).toHaveProperty('type', 'ReducerExpression')
  expect(result.params).toEqual({})

  expect(result.value).toHaveProperty('type', 'ReducerExpression')
  expect(result.compose).toBeInstanceOf(Array)
})

describe('parse loose modifiers', () => {
  test('modelFactory#create default', () => {
    const result = modelFactory.create({
      map: '$a'
    })

    expect(result.compose).toBeInstanceOf(Array)
    expect(result.compose[0]).toHaveProperty('type', 'map')
    expect(result.compose[0].transform).toHaveProperty(
      'type',
      'ReducerExpression'
    )
  })

  test('modelFactory#create default', () => {
    const result = modelFactory.create({
      map: '$a',
      find: '$a',
      filter: '$a'
    })

    expect(result.compose).toBeInstanceOf(Array)
    expect(result.compose[0]).toHaveProperty('type', 'filter')
    expect(result.compose[1]).toHaveProperty('type', 'map')
    expect(result.compose[2]).toHaveProperty('type', 'find')
  })
})

describe('parse compose modifier', () => {
  test('parses from compose property', () => {
    const result = modelFactory.create({
      compose: [{ map: '$a' }]
    })

    expect(result.compose).toBeInstanceOf(Array)
    expect(result.compose[0]).toHaveProperty('type', 'map')
    expect(result.compose[0].transform).toHaveProperty(
      'type',
      'ReducerExpression'
    )
  })

  test('throw error if compose is not an array', () => {
    expect(() => {
      modelFactory.create({
        compose: { map: '$a' }
      })
    }).toThrow()
  })

  test('throw error if compose is mixed with inline modoifiers (map, filter, ..) ', () => {
    expect(() => {
      modelFactory.create(
        {
          compose: [{ map: '$a' }],
          map: '$a',
          filter: '$a'
        },
        ['filter', 'map', 'find']
      )
    }).toThrow(/filter, map/)
  })

  test('parses multiple modifiers, respect order', () => {
    const result = modelFactory.create({
      compose: [{ map: '$a' }, { find: '$a' }, { filter: '$a' }]
    })

    expect(result.compose).toBeInstanceOf(Array)
    expect(result.compose[0]).toHaveProperty('type', 'map')
    expect(result.compose[1]).toHaveProperty('type', 'find')
    expect(result.compose[2]).toHaveProperty('type', 'filter')
  })
})
