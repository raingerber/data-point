const deepFreeze = require('deep-freeze')
const defaultTo = require('lodash/defaultTo')

const { normalizeTypeCheckSource } = require('../../helpers/type-check-helpers')
const createReducer = require('../../reducer-types').create
const { createNode } = require('../../debug-utils')

/**
 * @param {Function} Factory - factory function to create the entity
 * @param {Object} spec
 * @param {string} entityId
 * @param {Map} tree
 */
function create (Factory, spec, entityId, tree) {
  const entity = new Factory(spec)

  entity.id = entityId
  if (tree) {
    // TODO what is this for?
    entity.root = createReducer(entityId, { tree })
  }

  if (spec.before) {
    entity.before = createReducer(spec.before, { tree })
    tree && tree.set(entity.before, createNode(entity.root, 'before'))
  }

  if (spec.value) {
    entity.value = createReducer(spec.value, { tree })
    tree && tree.set(entity.value, createNode(entity.root, 'value'))
  }

  if (spec.after) {
    entity.after = createReducer(spec.after, { tree })
    tree && tree.set(entity.after, createNode(entity.root, 'after'))
  }

  if (spec.error) {
    entity.error = createReducer(spec.error, { tree })
    tree && tree.set(entity.error, createNode(entity.root, 'error'))
  }

  if (spec.inputType) {
    const inputType = normalizeTypeCheckSource(spec.inputType)
    entity.inputType = createReducer(inputType, { tree })
    tree && tree.set(entity.inputType, createNode(entity.root, 'inputType'))
  }

  if (spec.outputType) {
    const outputType = normalizeTypeCheckSource(spec.outputType)
    entity.outputType = createReducer(outputType, { tree })
    tree && tree.set(entity.outputType, createNode(entity.root, 'outputType'))
  }

  entity.params = deepFreeze(defaultTo(spec.params, {}))

  return entity
}

module.exports.create = create
