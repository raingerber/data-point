'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const resolveReducerPath = require('./reducer-path')
const resolveReducerFunction = require('./reducer-function')
const resolveEntity = require('./reducer-entity')
const createReducers = require('../transform-expression').createReducers
const utils = require('../utils')

/**
 *
 *
 * @param {Object} store
 * @param {any} reducerType
 * @returns
 */
function getReducerFunction (store, reducerType) {
  let reducerResolver

  /* eslint indent: ["error", 2, { "SwitchCase": 1 }] */
  switch (reducerType) {
    case 'ReducerPath':
      reducerResolver = _.partial(
        resolveReducerPath.resolve,
        store.filters,
        resolve
      )
      break
    case 'ReducerFunction':
      reducerResolver = _.partial(resolveReducerFunction.resolve, store.filters)
      break
    case 'ReducerEntity':
      /* eslint no-use-before-define: "off" */
      // IMPORTANT: recursiveness here - watch out!
      reducerResolver = _.partial(resolveEntity.resolve, store, resolve)
      break
    default:
      throw new Error(`Reducer type '${reducerType}' was not recognized`)
  }

  return reducerResolver
}

module.exports.getReducerFunction = getReducerFunction

/**
 * apply a Reducer to a accumulator
 *
 * @param {Object} store
 * @param {Accumulator} accumulator
 * @param {Reducer} reducer
 * @returns {Promise<Accumulator>}
 */
function resolveReducer (store, accumulator, reducer) {
  const reducerFunction = getReducerFunction(store, reducer.type)
  const result = reducerFunction(accumulator, reducer)
  return result
}

module.exports.resolveReducer = resolveReducer

const reduceContext = store => (accumulator, reducer) => {
  return resolveReducer(store, accumulator, reducer)
}

module.exports.reduceContext = reduceContext

/**
 * @param {Array<Reducer>} reducers
 * @param {Function} resolver
 * @returns {Promise}
 */
function chainReducers (reducers, resolver) {
  if (reducers.length === 0) {
    return Promise.resolve.bind(Promise)
  }

  let index = 0

  const appendReducers = newReducers => {
    reducers = reducers.slice(index).concat(newReducers)
  }

  const resolveTo = value => {
    appendReducers([acc => utils.set(acc, 'value', value)])
  }

  const resolveWith = value => {
    appendReducers(createReducers(value))
  }

  const resolveNext = promise => {
    if (index >= reducers.length) {
      return promise
    }

    const nextReducer = reducers[index++]
    return promise.then(acc => resolveNext(resolver(acc, nextReducer)))
  }

  return acc => {
    acc = utils.assign(acc, { resolveTo, resolveWith })
    return resolveNext(Promise.resolve(acc))
  }
}

module.exports.chainReducers = chainReducers

/**
 * resolves a given transform
 *
 * @param {Object} store
 * @param {Accumulator} accumulator
 * @param {any} transform
 * @returns {Promise<Accumulator>}
 */
function resolve (store, accumulator, transform) {
  if (transform.reducers.length === 0) {
    return Promise.resolve(accumulator)
  }

  const reduceTransformReducer = reduceContext(store)
  const reducer = chainReducers(transform.reducers, reduceTransformReducer)
  return reducer(accumulator)
}

module.exports.resolve = resolve
