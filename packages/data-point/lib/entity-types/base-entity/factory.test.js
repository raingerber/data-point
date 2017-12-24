/* eslint-env jest */
'use strict'

const createBaseEntity = require('./factory').create

describe('factory.createBaseEntity', () => {
  test('It should create entity defaults', () => {
    function FooEntity () {}
    const entity = createBaseEntity(
      FooEntity,
      {
        before: '$.',
        value: '$.',
        error: '$.',
        after: '$.'
      },
      'foo'
    )

    expect(entity).toHaveProperty('id', 'foo')
    expect(entity).toHaveProperty('value.type', 'ReducerExpression')
    expect(entity).toHaveProperty('error.type', 'ReducerExpression')
    expect(entity).toHaveProperty('after.type', 'ReducerExpression')
    expect(entity).toHaveProperty('params', {})
  })
})
