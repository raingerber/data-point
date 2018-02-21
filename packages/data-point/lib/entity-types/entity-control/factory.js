const _ = require('lodash')

const createReducer = require('../../reducer-types').create
const createBaseEntity = require('../base-entity').create
const { validateModifiers } = require('../validate-modifiers')

/**
 * @class
 */
function EntityControl () {
  this.select = undefined
}

module.exports.EntityControl = EntityControl

/**
 * @param {Object} spec - key/value where each value will be mapped into a reducer
 * @return {Array}
 */
function parseCaseStatements (spec) {
  return spec
    .filter(statement => statement.case)
    .map(statement => parseCaseStatement(statement))
}

module.exports.parseCaseStatements = parseCaseStatements

/**
 * map each key from spec into a reducer
 * @param {Object} statement - each value will be mapped into a reducer
 *                             the keys should be "case" and "do"
 * @return {Object}
 */
function parseCaseStatement (statement) {
  return _.mapValues(statement, source => createReducer(source))
}

module.exports.parseCaseStatement = parseCaseStatement

/**
 *
 * @param {string} id
 * @param {Array} select
 * @throws if default case is not defined
 * @return {*}
 */
function parseDefaultStatement (id, select) {
  const defaultCase = select.find(statement => statement.default)
  if (defaultCase) {
    return defaultCase.default
  }

  throw new Error(
    `It seems ${id} is missing its default case, Control entities must have their default case handled.`
  )
}

/**
 * @param {Object} spec
 * @return {Object}
 */
function parseSwitch (spec) {
  const select = spec.select
  const defaultStatement = parseDefaultStatement(spec.id, select)
  return {
    cases: parseCaseStatements(select),
    default: createReducer(defaultStatement)
  }
}

module.exports.parseSwitch = parseSwitch

/**
 * Creates new Entity Object
 * @param {Object} spec
 * @param {string} entityId
 * @return {EntityControl} Entity Object
 */
function create (spec, entityId) {
  validateModifiers(entityId, spec, ['select'])
  const entity = createBaseEntity(EntityControl, spec, entityId)
  entity.select = parseSwitch(spec)
  return Object.freeze(entity)
}

module.exports.create = create
