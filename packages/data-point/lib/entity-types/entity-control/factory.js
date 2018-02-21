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
 * @param {Array} spec
 * @param {String} id
 * @return {Array}
 */
function parseCaseStatements (spec, id) {
  return spec
    .filter(statement => statement.case)
    .map((statement, index) =>
      _.mapValues(statement, value =>
        createReducer(value, { parent: id, id: `case[${index}]` })
      )
    )
}

module.exports.parseCaseStatements = parseCaseStatements

/**
 * @param {String} id
 * @param {Array} select
 * @return {*}
 */
function parseDefaultStatement (id, select) {
  const defaultCase = select.find(statement => {
    return statement.default
  })
  if (!defaultCase) {
    throw new Error(
      `It seems ${id} is missing its default case, Control entities must have their default case handled.`
    )
  }
  return defaultCase.default
}
/**
 * @param {Object} spec
 * @param {String} id
 * @return {Object}
 */
function parseSwitch (spec, id) {
  const select = spec.select
  // TODO what is spec.id in this case??? also search for other instances
  const defaultStatement = parseDefaultStatement(spec.id, select)
  return {
    cases: parseCaseStatements(select, id),
    default: createReducer(defaultStatement, { parent: id, id: 'default' })
  }
}
module.exports.parseSwitch = parseSwitch

/**
 * Creates new Entity Object
 * @param  {Object} spec - spec
 * @param {string} id - Entity id
 * @return {EntityControl} Entity Object
 */
function create (spec, id) {
  validateModifiers(id, spec, ['select'])
  const entity = createBaseEntity(EntityControl, spec, id)
  entity.select = parseSwitch(spec, id)
  return Object.freeze(entity)
}

module.exports.create = create
