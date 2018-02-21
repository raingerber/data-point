const util = require('util')
const attempt = require('lodash/attempt')

const { IS_REDUCER, DEFAULT_VALUE } = require('./reducer-symbols')

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
  return !!(item && item[IS_REDUCER])
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

// * @param {Function} create // TODO remove this
// * @param {Map} tree
// * @throws if source is not a valid type for creating a reducer
// * @return {Reducer}
// */
// function createReducer (source, create = createReducer, tree) {
//  source = dealWithPipeOperators(source)
/**
 * @param {*} source
 * @param {Object} options
 * @param {Function} options.createReducer - optional
 * @param {Map} options.tree - optional
 * @throws if source is not a valid type for creating a reducer
 * @return {Reducer}
 */
function createReducer (source, options = {}) {
  source = normalizeInput(source)
  const reducerType = reducerTypes.find(r => r.isType(source))
  if (reducerType === undefined) {
    const message = [
      'Invalid reducer type.',
      ' Could not find a matching reducer type while parsing the value:\n ',
      attempt(util.inspect, source),
      '\nTry using an Array, String, Object, or Function.\n',
      'More info: https://github.com/ViacomInc/data-point/tree/master/packages/data-point#reducers\n'
    ].join('')

    throw new Error(message)
  }

  const create = options.createReducer || createReducer
  // NOTE: recursive call
  const reducer = reducerType.create(create, source, options.tree)
  if (options.hasOwnProperty('default')) {
    reducer[DEFAULT_VALUE] = { value: options.default }
  }

  reducer[IS_REDUCER] = true
  return Object.freeze(reducer)
}

module.exports.create = createReducer

function createDebugHelper (tree) {
  // let uid = 0
  const create = source => {
    const reducer = createReducer(source, { create, tree })
    // reducer[uid] = uid++
    return reducer
  }

  return create
}

module.exports.createDebugHelper = createDebugHelper

function createDebug (source) {
  const tree = new Map()
  const reducer = createDebugHelper(tree)(source)
  return { reducer, tree }
}

module.exports.createDebug = createDebug
