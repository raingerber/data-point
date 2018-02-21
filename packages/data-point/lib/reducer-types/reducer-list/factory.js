const _ = require('lodash')

const { createNode } = require('../../debug-utils')

const REDUCER_LIST = 'ReducerList'

module.exports.type = REDUCER_LIST

/**
 * @class
 * @property {string} type
 * @property {Array<reducer>} reducers
 * @property {boolean} isEmpty
 */
function ReducerList () {
  this.type = 'ReducerList'
  this.reducers = []
}

module.exports.Constructor = ReducerList

/**
 * @param {*} source
 * @returns {boolean}
 */
function isType (source) {
  return Array.isArray(source)
}

module.exports.isType = isType

/**
 * @param {string} source
 * @returns {Array}
 */
function parseFromString (source) {
  const reducerSource = _.defaultTo(source, '')
  const tokens = _.compact(reducerSource.split(' | '))
  return tokens
}

module.exports.parseFromString = parseFromString

/**
 * @param {*} source
 * @returns {*}
 */
function parseTokenExpression (source) {
  return _.isString(source) ? parseFromString(source) : source
}

module.exports.parseTokenExpression = parseTokenExpression

/**
 * @param {Array} source
 * @returns {Array}
 */
function parseFromArray (source) {
  return _.chain(source)
    .compact()
    .map(parseTokenExpression)
    .flatten()
    .value()
}

module.exports.parseFromArray = parseFromArray

/**
 * @param {*} source
 * @returns {Array}
 */
function parse (source) {
  return parseFromArray(source ? _.castArray(source) : [])
}

module.exports.parse = parse

/**
 * @param {Function} createReducer
 * @param {Array} source
 * @param {Map} tree
 * @return {Reducer}
 */
function create (createReducer, source, tree) {
  const tokens = parse(source)
  const reducers = tokens.map(token => {
    return createReducer(token, { tree })
  })

  const reducer = new ReducerList()
  reducer.reducers = reducers

  tree &&
    reducers.forEach((r, index) => {
      tree.set(r, createNode(reducer, index))
    })

  return reducer
}

module.exports.create = create
