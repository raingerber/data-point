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
 * @return {EntityModel} Entity Object
 */
function create (spec, entityId) {
  const entity = createBaseEntity(EntityModel, spec, entityId)
  return Object.freeze(entity)
}

module.exports.create = create
