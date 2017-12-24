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
 * @param {*} source
 * @returns {boolean}
 */
function isValid (source) {
  const type = typeof source
  return (
    type === 'string' ||
    type === 'function' ||
    source instanceof Array ||
    _.isPlainObject(source)
  )
}

module.exports.isValid = isValid

/**
 * @param {*} source
 * @throws if source is not a supported type
 * @return {boolean}
 */
function validate (source) {
  if (isValid(source)) {
    return true
  }
  const message = [
    `Could not parse a ReducerExpression. The ReducerExpression:\n `,
    _.attempt(util.inspect, source),
    '\nis not using a valid type, try using an Array, String, Object, or Function.',
    '\nMore info: https://github.com/ViacomInc/data-point/tree/master/packages/data-point#reducer-expression\n'
  ].join('')
  throw new Error(message)
}

module.exports.validate = validate

const reducerTypes = [ReducerEntity, ReducerFunction, ReducerPath]

/**
 * parse reducer
 * @param  {string} source - reducer string representation
 * @return {reducer}
 */
function createReducer (createTransform, source) {
  // ReducerObject requires an extra parameter, so
  // it's not included in the reducerTypes array
  if (ReducerObject.isType(source)) {
    return ReducerObject.create(createTransform, source)
  }

  const reducer = reducerTypes.find(r => r.isType(source))

  if (_.isUndefined(reducer)) {
    const message = [
      'Invalid reducer type.',
      ' Could not find a matching reducer type while parsing the value:\n ',
      _.attempt(util.inspect, source),
      '\nFor a list of supported types visit:\n',
      'https://github.com/ViacomInc/data-point/tree/master/packages/data-point#reducers\n'
    ].join('')

    throw new Error(message)
  }

  return reducer.create(source)
}

/**
 * @param {*} source
 * @return {Transform}
 */
function create (source = []) {
  validate(source)
  const tokens = parse(source)
  const reducers = tokens.map(token => createReducer(create, token))

  const transform = new ReducerExpression()
  transform.reducers = reducers

  return Object.freeze(transform)
}

module.exports.create = create
