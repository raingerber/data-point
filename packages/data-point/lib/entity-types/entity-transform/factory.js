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
 * @return {EntityTransform} Entity Object
 */
function create (spec, entityId) {
  const entity = createBaseEntity(
    EntityTransform,
    {
      value: spec
    },
    entityId
  )
  return Object.freeze(entity)
}

module.exports.create = create
