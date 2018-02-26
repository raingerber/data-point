const ObjectStoreManager = require('./object-store-manager')

/**
 * @param {string} path
 * @return {Object} Error Object properties
 */
function errorInfoCbGet (path) {
  return {
    message: `Value in '${path}' is undefined`,
    name: 'InvalidPath'
  }
}

/**
 * @param {string} path
 * @return {Object} Error Object properties
 */
function errorInfoCbAdd (path) {
  return {
    message: `Value '${path}' already exists`,
    name: 'InvalidPath'
  }
}

/**
 * create instance
 * @return {Object}
 */
function create () {
  return ObjectStoreManager.create({
    errorInfoCbGet,
    errorInfoCbAdd
  })
}

module.exports.create = create
