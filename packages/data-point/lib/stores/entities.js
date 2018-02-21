const _ = require('lodash')

const storeManager = require('./store-manager')
const getCreate = require('../reducer-types').getCreate

/**
 * @param {Object} entityTypes
 * @param {Map} tree
 * @param {Object} source
 * @param {string} id
 * @return {Reducer}
 */
function createEntity (entityTypes, tree, source, id) {
  const tokens = id.split(':')
  const entityType = tokens[0]
  const EntityType = entityTypes.get(entityType)
  const entity = EntityType.create(getCreate(tree), source, id)
  return entity
}

module.exports.createEntity = createEntity

/**
 * @param {string} id
 * @return {Object} Error Object properties
 */
function errorInfoCbGet (id) {
  return {
    message: `Entity id '${id}' is not defined`,
    name: 'InvalidId'
  }
}

/**
 * @param {string} id
 * @return {Object} Error Object properties
 */
function errorInfoCbAdd (id) {
  return {
    message: `Entity with id '${id}' already exists`,
    name: 'InvalidId'
  }
}

/**
 * create instance
 * @param {Object} entityTypes
 * @param {Map} tree
 * @return {Object}
 */
function create (entityTypes, tree) {
  return storeManager.create({
    errorInfoCbGet,
    errorInfoCbAdd,
    create: _.partial(createEntity, entityTypes, tree)
  })
}

module.exports.create = create
