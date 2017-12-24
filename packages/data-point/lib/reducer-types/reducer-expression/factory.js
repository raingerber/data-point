'use strict'

const _ = require('lodash')
const util = require('util')

const ReducerEntity = require('../reducer-entity')
const ReducerFunction = require('../reducer-function')
const ReducerObject = require('../reducer-object')
const ReducerPath = require('../reducer-path')

const REDUCER_EXPRESSION = 'ReducerExpression'

module.exports.type = REDUCER_EXPRESSION

/**
 * @class
 * @property {string} type - @see reducerType
 * @property {Array} reducers - collection of reducers that will be applied
 */
function ReducerExpression () {
  this.type = REDUCER_EXPRESSION
  this.reducers = []
}

module.exports.ReducerExpression = ReducerExpression

/**
 * @param {string} source
 * @returns {Array}
 */
function parseFromString (source) {
  const transformSource = _.defaultTo(source, '')
  const tokens = _.compact(transformSource.split(' | '))
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
 * @param {*} src
 * @returns {Array}
 */
function parse (src) {
  let source = _.defaultTo(src, [])
  source = _.castArray(source)
  return parseFromArray(source)
}

module.exports.parse = parse

/**
 * @param {Function} createTransform
 * @param {Object|Function|Array|string} source - source for creating a reducer
 * @return {reducer}
 */
function createReducer (createTransform, source) {
  // checking this separately because it requires a second parameter
  if (ReducerObject.isType(source)) {
    return ReducerObject.create(createTransform, source)
  }

  const reducer = [ReducerEntity, ReducerFunction, ReducerPath].find(r =>
    r.isType(source)
  )

  if (_.isUndefined(reducer)) {
    const message = [
      'Invalid reducer type. Could not find a matching reducer type while parsing the value:\n',
      _.attempt(util.inspect, source),
      '\nTry using an Array, String, Object, or Function.\n',
      'More info: https://github.com/ViacomInc/data-point/tree/master/packages/data-point#reducers\n'
    ].join('')

    throw new Error(message)
  }

  return reducer.create(source)
}

/**
 * @param {Object|Function|Array|string} source
 * @return {ReducerExpression}
 */
function create (source = []) {
  const tokens = parse(source)
  const reducers = tokens.map(token => createReducer(create, token))

  const transform = new ReducerExpression()
  transform.reducers = reducers

  return Object.freeze(transform)
}

module.exports.create = create
