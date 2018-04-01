const isPlainObject = require('lodash/isPlainObject')

// const constant = require('../reducer-helpers/constant').create

const REDUCER_OBJECT = 'ReducerObject'

module.exports.type = REDUCER_OBJECT

/**
 * @class
 * @property {string} type - @see reducerType
 * @property {Function} source
 * @property {Array<Object>} reducers
 * @property {boolean} isEmpty
 */
function ReducerObject () {
  this.type = REDUCER_OBJECT
  this.source = undefined
  this.reducers = undefined
}

module.exports.Constructor = ReducerObject

/**
 * @param {*} source
 * @returns {boolean}
 */
function isType (source) {
  return isPlainObject(source)
}

module.exports.isType = isType

/**
 * @return {Object}
 */
// function newProps () {
//   return {
//     constants: [],
//     reducers: []
//   }
// }

// module.exports.newProps = newProps

/**
 * @param {Function} createReducer
 * @param {Object} source
 * @param {Array} stack
 * @param {Array} props
 * @returns {Array}
 */
function getProps (createReducer, source, stack = [], props = []) {
  for (let key of Object.keys(source)) {
    const path = stack.concat(key)
    const value = source[key]
    if (isPlainObject(value)) {
      // NOTE: recursive call
      getProps(createReducer, value, path, props)
      continue
    }

    const reducer = createReducer(value)
    props.push({ path, reducer })
  }

  return props
}

module.exports.getProps = getProps

/**
 * @param {Object} source
 * @return {Function}
 */
// function getSourceFunction (source) {
//   return function source () {
//     return _.cloneDeep(source)
//   }
// }

// module.exports.getSourceFunction = getSourceFunction

/**
 * @param {Function} createReducer
 * @param {Object} source
 * @returns {reducer}
 */
function create (createReducer, source = {}) {
  const reducers = getProps(createReducer, source)

  const reducer = new ReducerObject()
  // reducer.source = getSourceFunction(props.constants)
  reducer.reducers = reducers
  if (reducers.every(({ reducer }) => reducer.__sync__)) {
    reducer.__sync__ = true
  }

  return reducer
}

module.exports.create = create
