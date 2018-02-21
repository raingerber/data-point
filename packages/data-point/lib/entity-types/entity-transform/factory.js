const createBaseEntity = require('../base-entity').create

/**
 * @class
 */
function EntityTransform () {}

module.exports.EntityTransform = EntityTransform

/**
 * Creates new Entity Object
 * @param {*} spec
 * @param {string} entityId
 * @param {Map} tree
 * @return {EntityTransform} Entity Object
 */
function create (spec, entityId, tree) {
  const entity = createBaseEntity(
    EntityTransform,
    {
      value: spec
    },
    entityId,
    tree
  )
  return Object.freeze(entity)
}

module.exports.create = create
