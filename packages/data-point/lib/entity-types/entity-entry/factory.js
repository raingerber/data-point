const createBaseEntity = require('../base-entity').create
const { validateModifiers } = require('../validate-modifiers')

/**
 * @class
 */
function EntityEntry () {}

module.exports.EntityEntry = EntityEntry

/**
 * Creates new Entity Object
 * @param {Object} spec
 * @param {string} entityId
 * @param {Map} tree
 * @return {EntityEntry} Entity Object
 */
function create (spec, entityId, tree) {
  validateModifiers(entityId, spec, [])
  const entity = createBaseEntity(EntityEntry, spec, entityId, tree)
  return Object.freeze(entity)
}

module.exports.create = create
