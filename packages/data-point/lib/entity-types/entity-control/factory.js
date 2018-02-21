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
 * map each key from spec into a reducer
 * @param {Object} statement - each value will be mapped into a reducer
 *                             the keys should be "case" and "do"
 * @param {Map} tree
 * @returns
 */
function parseCaseStatement (statement, tree) {
  return _.mapValues(statement, source => createReducer(source, { tree }))
}

module.exports.parseCaseStatement = parseCaseStatement

/**
 * Parse only case statements
 * @param {hash} spec - key/value where each value will be mapped into a reducer
 * @param {Map} tree
 * @returns
 */
function parseCaseStatements (spec, tree) {
  return spec
    .filter(statement => !statement.case)
    .map(statement => parseCaseStatement(statement, tree))
}

module.exports.parseCaseStatements = parseCaseStatements

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
 * @param {Map} tree
 * @returns
 */
function parseSwitch (spec, tree) {
  const select = spec.select
  const defaultStatement = parseDefaultStatement(spec.id, select)
  return {
    cases: parseCaseStatements(select, tree),
    default: createReducer(defaultStatement, { tree })
  }
}

module.exports.parseSwitch = parseSwitch

/**
 * Creates new Entity Object
 * @param  {Object} spec - spec
 * @param {string} id - Entity id
 * @param {Map} tree
 * @return {EntityControl} Entity Object
 */
function create (spec, id, tree) {
  validateModifiers(id, spec, ['select'])
  const entity = createBaseEntity(EntityControl, spec, id, tree)
  entity.select = parseSwitch(spec, tree)
  return Object.freeze(entity)
}

module.exports.create = create
