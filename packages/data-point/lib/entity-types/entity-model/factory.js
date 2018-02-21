const createBaseEntity = require('../base-entity').create

/**
 * @class
 */
function EntityModel () {}

module.exports.EntityModel = EntityModel

/**
 * Creates new Entity Object
 * @param  {Object} spec - spec
 * @param {string} id - Entity id
 * @param {Map} tree
 * @return {EntityModel} Entity Object
 */
function create (spec, id, tree) {
  const entity = createBaseEntity(EntityModel, spec, id, tree)
  return Object.freeze(entity)
}

module.exports.create = create
