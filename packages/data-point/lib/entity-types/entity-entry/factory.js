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
 * @return {EntityEntry} Entity Object
 */
function create (spec, entityId) {
  validateModifiers(entityId, spec, [])
  const entity = createBaseEntity(EntityEntry, spec, entityId)
  return Object.freeze(entity)
}

module.exports.create = create
