const parseCompose = require('../parse-compose')
const createReducer = require('../../reducer-types').create
const createBaseEntity = require('../base-entity').create
const reducerHelpers = require('../../reducer-types/reducer-helpers')
const { validateModifiers } = require('../validate-modifiers')
const {
  getTypeCheckSourceWithDefault
} = require('../../helpers/type-check-helpers')

/**
 * @class
 */
function EntityCollection () {}

module.exports.EntityCollection = EntityCollection

const modifierKeys = ['filter', 'map', 'find']

const modifiers = {
  filter: reducerHelpers.stubFactories.filter,
  find: reducerHelpers.stubFactories.find,
  map: reducerHelpers.stubFactories.map
}

/**
 * @param {Array<Object>} composeSpec
 * @param {Map} tree
 * @return {Reducer}
 */
function createCompose (composeSpec, tree) {
  const stubs = composeSpec.map(modifier => {
    const factory = modifiers[modifier.type]
    return factory(modifier.spec)
  })

  return createReducer(stubs, { tree })
}

/**
 * Creates new Entity Object
 * @param {Object} spec - spec
 * @param {string} id - Entity id
 * @param {Map} tree
 * @return {EntityCollection} Entity Object
 */
function create (spec, id, tree) {
  validateModifiers(id, spec, modifierKeys.concat('compose'))
  parseCompose.validateComposeModifiers(id, spec, modifierKeys)

  const outputType = getTypeCheckSourceWithDefault(
    'collection',
    'array',
    spec.outputType
  )
  spec = Object.assign({}, spec, { outputType })

  const entity = createBaseEntity(EntityCollection, spec, id, tree)

  const composeSpec = parseCompose.parse(spec, modifierKeys)
  parseCompose.validateCompose(entity.id, composeSpec, modifierKeys)
  if (composeSpec.length) {
    entity.compose = createCompose(composeSpec, tree)
  }

  return Object.freeze(entity)
}

module.exports.create = create
