const createBaseEntity = require('../base-entity').create
const { validateModifiers } = require('../validate-modifiers')

/**
 * @class
 */
function EntityEntry () {}

module.exports.EntityEntry = EntityEntry

/**
 * Creates new Entity Object
 * @param  {Object} spec - spec
 * @param {string} id - Entity id
 * @param {Map} tree
 * @return {EntityEntry} Entity Object
 */
function create (spec, id, tree) {
  validateModifiers(id, spec, [])
  const entity = createBaseEntity(EntityEntry, spec, id, tree)
  return Object.freeze(entity)
}

module.exports.create = create
