const _ = require('lodash')
const createBaseEntity = require('../base-entity').create
const createReducer = require('../../reducer-types').create
const { validateModifiers } = require('../validate-modifiers')

/**
 * @class
 * @property {string} url
 * @property {Reducer} options
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
 * @param {Object} spec
 * @param {string} entityId
 * @return {EntityRequest} Entity Object
 */
function create (spec, entityId) {
  validateModifiers(entityId, spec, ['options', 'url'])
  const entity = createBaseEntity(EntityRequest, spec, entityId)
  entity.url = _.defaultTo(spec.url, '')
  entity.options = createReducer(spec.options || defaultOptions)

  return Object.freeze(entity)
}

module.exports.create = create
