'use strict'

const _ = require('lodash')
const Promise = require('bluebird')

const middleware = require('../../middleware')

const utils = require('../../utils')

const PromiseArray = require('../../utils/promise-array')

function resolveErrorReducers (error, accumulator, resolveReducer) {
  const errorTransform = accumulator.reducer.spec.error

  if (errorTransform.reducers.length === 0) {
    return Promise.reject(error)
  }

  const errorAccumulator = utils.set(accumulator, 'value', error)

  const reducerResolved = resolveReducer(errorAccumulator, errorTransform)

  return reducerResolved.then(result =>
    utils.set(accumulator, 'value', result.value)
  )
}

module.exports.resolveErrorReducers = resolveErrorReducers

function createCurrentAccumulator (store, accumulator, reducer) {
  // get defined source
  const entity = store.entities.get(`${reducer.entityType}:${reducer.name}`)

  // set reducer's spec
  const currentReducer = utils.assign(reducer, {
    spec: entity,
    options: entity.options
  })

  // create accumulator to resolve
  const currentAccumulator = utils.assign(accumulator, {
    context: entity,
    reducer: currentReducer,
    initialValue: accumulator.value,
    // shortcut to reducer.spec.params
    params: entity.params
  })

  return currentAccumulator
}

module.exports.createCurrentAccumulator = createCurrentAccumulator

/**
 * @param {Object} store - dataPoint instance
 * @param {string} name - name of middleware to execute
 * @param {Accumulator} acc - current accumulator
 */
function resolveMiddleware (store, name, acc) {
  return middleware.resolve(store, name, acc).then(result => {
    const reqCtx = utils.assign(acc, {
      value: result.value,
      locals: result.locals,
      ___resolve: result.___resolve
    })

    return reqCtx
  })
}

module.exports.resolveMiddleware = resolveMiddleware

/**
 * @param {Accumulator} acc
 * @returns {boolean}
 */
const isDone = acc => acc.___resolve === true

module.exports.isDone = isDone

function resolveEntity (
  store,
  resolveTransform,
  accumulator,
  reducer,
  mainResolver
) {
  const currentAccumulator = createCurrentAccumulator(
    store,
    accumulator,
    reducer
  )

  const trace =
    currentAccumulator.trace === true ||
    currentAccumulator.reducer.spec.params.trace === true

  let accUid = currentAccumulator
  let timeId
  if (trace === true) {
    accUid = utils.set(currentAccumulator, 'euid', utils.getUID())
    timeId = `⧖ ${accUid.context.id}(${accUid.euid})`
    console.time(timeId)
  }

  const reducers = [
    acc => resolveMiddleware(store, `before`, acc),
    acc => resolveMiddleware(store, `${reducer.entityType}:before`, acc),
    acc => resolveTransform(acc, acc.reducer.spec.before),
    acc => mainResolver(acc, resolveTransform),
    acc => resolveTransform(acc, acc.reducer.spec.after),
    acc => resolveMiddleware(store, `${reducer.entityType}:after`, acc),
    acc => resolveMiddleware(store, `after`, acc)
  ]

  return PromiseArray.reduce(reducers, { isDone })(accUid)
    .catch(error => {
      // attach entity information to help debug
      error.entityId = currentAccumulator.reducer.spec.id
      return resolveErrorReducers(error, currentAccumulator, resolveTransform)
    })
    .then(resultContext => {
      if (trace === true) {
        console.timeEnd(timeId)
      }

      // clean up any modifications we have done to the result context and pass
      // a copy of the original accumulator with only `value` modified
      return utils.set(accumulator, 'value', resultContext.value)
    })
}

module.exports.resolveEntity = resolveEntity

function resolve (store, resolveReducer, accumulator, reducer, mainResolver) {
  const resolveTransform = _.partial(resolveReducer, store)
  const shouldMapCollection =
    reducer.asCollection && accumulator.value instanceof Array

  if (!shouldMapCollection) {
    return resolveEntity(
      store,
      resolveTransform,
      accumulator,
      reducer,
      mainResolver
    )
  }

  return Promise.map(accumulator.value, itemValue => {
    const itemCtx = utils.set(accumulator, 'value', itemValue)
    return resolveEntity(
      store,
      resolveTransform,
      itemCtx,
      reducer,
      mainResolver
    )
  }).then(mappedResults => {
    const value = mappedResults.map(acc => acc.value)
    return utils.set(accumulator, 'value', value)
  })
}

module.exports.resolve = resolve
