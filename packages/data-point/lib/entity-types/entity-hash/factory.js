const createReducer = require('../../reducer-types').create
const deepFreeze = require('deep-freeze')
const constant = require('lodash/constant')
const defaultTo = require('lodash/defaultTo')
const reducerHelpers = require('../../reducer-types/reducer-helpers')
const parseCompose = require('../parse-compose')
const createBaseEntity = require('../base-entity').create
const { validateModifiers } = require('../validate-modifiers')

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
 *
 * @param {Array} composeParse
 * @param {Map} tree
 * @return {Reducer}
 */
function createCompose (composeParse, tree) {
  const specList = composeParse.map(modifier => {
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

  return createReducer(specList, tree)
}

/**
 * Creates new Entity Object
 * @param  {Object} spec - spec
 * @param {string} id - Entity id
 * @param {Map} tree
 * @return {EntityHash} Entity Object
 */
function create (spec, id, tree) {
  validateModifiers(id, spec, modifierKeys.concat('compose'))
  parseCompose.validateComposeModifiers(id, spec, modifierKeys)

  const entity = createBaseEntity(EntityHash, spec, id, tree)

  const compose = parseCompose.parse(spec, modifierKeys)
  parseCompose.validateCompose(entity.id, compose, modifierKeys)
  entity.compose = createCompose(compose, tree)

  return Object.freeze(entity)
}

module.exports.create = create
