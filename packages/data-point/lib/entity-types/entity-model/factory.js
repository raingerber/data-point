const createBaseEntity = require('../base-entity').create

/**
 * @class
 */
function EntityModel () {}

module.exports.EntityModel = EntityModel

/**
 * Creates new Entity Object
 * @param {Object} spec
 * @param {string} entityId
 * @param {Map} tree
 * @return {EntityModel} Entity Object
 */
function create (spec, entityId, tree) {
  const entity = createBaseEntity(EntityModel, spec, entityId, tree)
  return Object.freeze(entity)
}

module.exports.create = create
