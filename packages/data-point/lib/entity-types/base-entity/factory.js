const deepFreeze = require('deep-freeze')
const defaultTo = require('lodash/defaultTo')

const typeCheckFunctionReducers = require('../../helpers/type-check-function-reducers')
const createReducer = require('../../reducer-types').create
const { createNode } = require('../../debug-utils')

const typeCheckModifiers = {
  string: typeCheckFunctionReducers.isString,
  number: typeCheckFunctionReducers.isNumber,
  boolean: typeCheckFunctionReducers.isBoolean,
  function: typeCheckFunctionReducers.isFunction,
  error: typeCheckFunctionReducers.isError,
  array: typeCheckFunctionReducers.isArray,
  object: typeCheckFunctionReducers.isObject
}

function getTypeModifier (reducer) {
  const typeCheckModifier = typeCheckModifiers[reducer]
  if (typeCheckModifier) {
    return typeCheckModifier
  }

  return reducer
}

module.exports.getTypeModifier = getTypeModifier

/**
 * @param {Function} Factory - factory function to create the entity
 * @param {Object} spec - spec for the Entity
 * @param {string} id - Entity's id
 * @param {Map} tree
 */
function create (Factory, spec, id, { root, tree }) {
  const entity = new Factory(spec)

  entity.id = id
  if (tree) {
    entity.root = tree ? createReducer(id, tree) : null
  }

  if (spec.before) {
    entity.before = createReducer(spec.before, tree)
    tree && tree.set(entity.before, createNode(entity.root, 'before'))
  }

  if (spec.value) {
    entity.value = createReducer(spec.value, tree)
    tree && tree.set(entity.value, createNode(entity.root, 'value'))
  }

  if (spec.after) {
    entity.after = createReducer(spec.after, tree)
    tree && tree.set(entity.after, createNode(entity.root, 'after'))
  }

  if (spec.error) {
    entity.error = createReducer(spec.error, tree)
    tree && tree.set(entity.error, createNode(entity.root, 'error'))
  }

  if (spec.inputType) {
    const inputType = getTypeModifier(spec.inputType)
    entity.inputType = createReducer(inputType, tree)
    tree && tree.set(entity.inputType, createNode(entity.root, 'inputType'))
  }

  if (spec.outputType) {
    const outputType = getTypeModifier(spec.outputType)
    entity.outputType = createReducer(outputType, tree)
    tree && tree.set(entity.outputType, createNode(entity.root, 'outputType'))
  }

  entity.params = deepFreeze(defaultTo(spec.params, {}))

  return entity
}

module.exports.create = create
