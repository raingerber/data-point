const util = require('util')
const attempt = require('lodash/attempt')

const utils = require('../utils')
const Symbols = require('./reducer-symbols')
const { createNode } = require('../debug-utils')
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

  const create = options.create || createReducer
  // NOTE: recursive call
  const reducer = reducerType.create(create, source)
  if (options.hasOwnProperty('default')) {
    reducer[Symbols.DEFAULT_VALUE] = { value: options.default }
  }

  reducer[Symbols.IS_REDUCER] = true
  return Object.freeze(reducer)
}

module.exports.create = createReducer

/**
 * @param {*} source
 * @return {Object}
 */
function createDebug (source) {
  const tree = new WeakMap()
  const create = (source, options) => {
    options = utils.assign(options, { create })
    const reducer = createReducer(source, options)
    tree.set(reducer, createNode(options.parent, options.id))
    return reducer
  }

  const reducer = create(source)
  return { reducer, tree }
}

module.exports.createDebug = createDebug
