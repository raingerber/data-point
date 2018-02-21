const util = require('util')
const attempt = require('lodash/attempt')

const utils = require('../utils')
const Symbols = require('./reducer-symbols')
const { createTreeNode } = require('../debug-utils')
const ReducerEntity = require('./reducer-entity')
const ReducerFunction = require('./reducer-function')
const ReducerHelpers = require('./reducer-helpers')
const ReducerList = require('./reducer-list')
const ReducerObject = require('./reducer-object')
const ReducerPath = require('./reducer-path')

const reducerTypes = [
  ReducerEntity,
  ReducerFunction,
  ReducerHelpers,
  ReducerList,
  ReducerObject,
  ReducerPath
]

/**
 * @param {*} item
 * @returns {boolean}
 */
function isReducer (item) {
  return !!(item && item[Symbols.IS_REDUCER])
}

module.exports.isReducer = isReducer

/**
 * this is here because ReducerLists can be arrays or | separated strings
 * @param {*} source
 * @returns {Array<reducer>|reducer}
 */
function normalizeInput (source) {
  let result = ReducerList.parse(source)
  if (result.length === 1) {
    // do not create a ReducerList that only contains a single reducer
    result = result[0]
  }

  return result
}

/**
 * @param {*} source
 * @param {Object} options
 * @throws if source is not a valid type for creating a reducer
 * @return {Reducer}
 */
function createReducer (source, options = {}) {
  source = normalizeInput(source)
  const reducerType = reducerTypes.find(r => r.isType(source))
  if (typeof reducerType === 'undefined') {
    const message = [
      'Invalid reducer type.',
      ' Could not find a matching reducer type while parsing the value:\n ',
      attempt(util.inspect, source),
      '\nTry using an Array, String, Object, or Function.\n',
      'More info: https://github.com/ViacomInc/data-point/tree/master/packages/data-point#reducers\n'
    ].join('')

    throw new Error(message)
  }

  // NOTE: recursive call
  const reducer = reducerType.create(options.create || createReducer, source)
  if (options.hasOwnProperty('default')) {
    reducer[Symbols.DEFAULT_VALUE] = { value: options.default }
  }

  reducer[Symbols.IS_REDUCER] = true
  return Object.freeze(reducer)
}

module.exports.create = createReducer

/**
 * @param {Map} tree
 * @return {Function}
 */
function getCreate (tree) {
  if (!tree) {
    return createReducer
  }

  /**
   * @param {*} source
   * @param {Object} options
   * @return {Reducer}
   */
  const create = (source, options) => {
    options = utils.assign(options, { create })
    const reducer = createReducer(source, options)
    const node = createTreeNode(options.parent, options.id)
    tree.set(reducer, node)
    return reducer
  }

  return create
}

module.exports.getCreate = getCreate
