const _ = require('lodash')

const createReducerMap = require('../reducer-helpers/reducer-map').create

const REDUCER_ENTITY = 'ReducerEntity'

module.exports.type = REDUCER_ENTITY

/**
 * Defines a entity reducer
 * @class
 * @property {string} type - @see reducerType
 * @property {string} id <entity-type>:<reducer-name>
 * @property {string} entityType - type of entity
 * @property {string} name - name of the reducer
 * @property {boolean} hasEmptyConditional
 */
function ReducerEntity () {
  this.type = REDUCER_ENTITY
  this.id = ''
  this.entityType = ''
  this.name = ''
  this.hasEmptyConditional = false
}

module.exports.ReducerEntity = ReducerEntity

/**
 * @param {*} source
 * @returns {boolean}
 */
function isType (source) {
  return (
    _.isString(source) &&
    source.match(/^([^$][\w.]*):([\w.-]+)(\[])?$/) !== null
  )
}

module.exports.isType = isType

/**
 * @param {Function} createReducer
 * @param {string} source
 * @return {reducer}
 */
function create (createReducer, source) {
  if (source.endsWith('[]')) {
    return createReducerMap(createReducer, source.replace(/\[]$/, ''))
  }

  const reducer = new ReducerEntity()
  const [entityType, name] = source.replace(/^\?/, '').split(':')
  reducer.id = `${entityType}:${name}`
  reducer.entityType = entityType
  reducer.name = name
  reducer.hasEmptyConditional = source.startsWith('?')

  return reducer
}

module.exports.create = create
