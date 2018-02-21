const _ = require('lodash')
const createBaseEntity = require('../base-entity').create
const { validateModifiers } = require('../validate-modifiers')

/**
 * @class
 * @property {string} url
 * @property {reducer} options
 */
function EntityRequest () {
  this.url = undefined
  this.options = undefined
}

module.exports.EntityRequest = EntityRequest

/**
 * @return {Object}
 */
function defaultOptions () {
  return {}
}

module.exports.defaultOptions = defaultOptions

/**
 * creates new Request based on spec
 * @param {Function} createReducer
 * @param {Object} spec - request spec
 * @param {string} id - Entity id
 * @return {EntityRequest} Entity Object
 */
function create (createReducer, spec, id) {
  validateModifiers(id, spec, ['options', 'url'])
  const entity = createBaseEntity(createReducer, EntityRequest, spec, id)
  entity.url = _.defaultTo(spec.url, '')
  entity.options = createReducer(spec.options || defaultOptions, {
    parent: id,
    id: 'options'
  })

  return Object.freeze(entity)
}

module.exports.create = create
