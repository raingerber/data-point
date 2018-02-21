const deepFreeze = require('deep-freeze')
const constant = require('lodash/constant')
const defaultTo = require('lodash/defaultTo')

const reducerHelpers = require('../../reducer-types/reducer-helpers')
const parseCompose = require('../parse-compose')
const createBaseEntity = require('../base-entity').create
const { validateModifiers } = require('../validate-modifiers')
const {
  getTypeCheckSourceWithDefault
} = require('../../helpers/type-check-helpers')

/**
 * @class
 */
function EntityHash () {}

module.exports.EntityHash = EntityHash

const modifierKeys = ['omitKeys', 'pickKeys', 'mapKeys', 'addValues', 'addKeys']

const modifiers = {
  omit: reducerHelpers.stubFactories.omit,
  pick: reducerHelpers.stubFactories.pick,
  map: reducerHelpers.stubFactories.map,
  assign: reducerHelpers.stubFactories.assign
}

/**
 * @param {Function} createReducer
 * @param {Array<Object>} composeSpec
 * @param {String} id
 * @return {Reducer}
 */
function createCompose (createReducer, composeSpec, id) {
  const specList = composeSpec.map(modifier => {
    let spec
    switch (modifier.type) {
      case 'omitKeys':
        spec = modifiers.omit(modifier.spec)
        break
      case 'pickKeys':
        spec = modifiers.pick(modifier.spec)
        break
      case 'mapKeys':
        spec = modifier.spec
        break
      case 'addValues':
        const values = deepFreeze(defaultTo(modifier.spec, {}))
        spec = modifiers.assign(constant(values))
        break
      case 'addKeys':
        spec = modifiers.assign(modifier.spec)
        break
    }

    return spec
  })

  return createReducer(specList, { parent: id, id: 'compose' })
}

/**
 * Creates new Entity Object
 * @param {Function} createReducer
 * @param {Object} spec - spec
 * @param {string} id - Entity id
 * @return {EntityHash} Entity Object
 */
function create (createReducer, spec, id) {
  validateModifiers(id, spec, modifierKeys.concat('compose'))

  const outputType = getTypeCheckSourceWithDefault(
    'hash',
    'object',
    spec.outputType
  )
  spec = Object.assign({}, spec, { outputType })

  const entity = createBaseEntity(createReducer, EntityHash, spec, id)
  const compose = parseCompose.parse(id, modifierKeys, spec)
  if (compose.length) {
    entity.compose = createCompose(createReducer, compose, id)
  }

  return Object.freeze(entity)
}

module.exports.create = create
