const createBaseEntity = require('../base-entity').create

/**
 * @class
 */
function EntityTransform () {}

module.exports.EntityTransform = EntityTransform

/**
 * Creates new Entity Object
 * @param  {*} spec - spec
 * @param {string} id - Entity id
 * @param {Map} tree
 * @return {EntityTransform} Entity Object
 */
function create (spec, id, tree) {
  const entity = createBaseEntity(
    EntityTransform,
    {
      value: spec
    },
    id,
    tree
  )
  return Object.freeze(entity)
}

module.exports.create = create
