/* eslint-env jest */

const debugUtils = require('./index')

describe('debugUtils#createNode', () => {
  it('should create a node without id', () => {
    const parent = {}
    const node = debugUtils.createNode(parent)
    expect(node.parent === parent).toBe(true)
    expect(node).toEqual({ parent })
  })

  it('should create a node with id', () => {
    const parent = {}
    const id = 'test-id'
    const node = debugUtils.createNode(parent, id)
    expect(node.parent === parent).toBe(true)
    expect(node).toEqual({ parent, id })
  })
})
