const ReducerEntity = require('./reducer-entity')
const ReducerFunction = require('./reducer-function')
const ReducerList = require('./reducer-list')
const ReducerObject = require('./reducer-object')
const ReducerPath = require('./reducer-path')
const ReducerHelpers = require('./reducer-helpers').reducers
const { DEFAULT_VALUE } = require('./reducer-symbols')

const reducers = Object.assign({}, ReducerHelpers, {
  [ReducerEntity.type]: ReducerEntity,
  [ReducerFunction.type]: ReducerFunction,
  [ReducerList.type]: ReducerList,
  [ReducerObject.type]: ReducerObject,
  [ReducerPath.type]: ReducerPath
})

/**
 * @param {Reducer} reducer
 * @return {boolean}
 */
function hasDefault (reducer) {
  return !!reducer[DEFAULT_VALUE]
}

module.exports.hasDefault = hasDefault

/**
 * @param {Reducer} reducer
 * @throws if reducer is not valid
 * @return {Function}
 */
function getResolveFunction (reducer) {
  const reducerType = reducers[reducer.type]
  if (!reducerType) {
    throw new Error(`Reducer type '${reducer.type}' was not recognized`)
  }

  return reducerType.resolve
}

/**
 * @param {Accumulator} accumulator
 * @return {Object}
 */
function thenable (accumulator) {
  return {
    then: cb => cb(accumulator)
  }
}

/**
 * apply a Reducer to an accumulator
 * @param {Object} manager
 * @param {Accumulator} accumulator
 * @param {Reducer} reducer
 * @returns {Promise}
 */
function resolveReducer (manager, accumulator, reducer) {
  // this conditional is here because BaseEntity#resolve
  // does not check that lifecycle methods are defined
  // before trying to resolve them
  if (!reducer) {
    return thenable(accumulator.value)
  }

  const resolve = getResolveFunction(reducer)
  // NOTE: recursive call
  const result = resolve(manager, resolveReducer, accumulator, reducer)
  if (hasDefault(reducer)) {
    const _default = reducer[DEFAULT_VALUE].value
    const resolveDefault = reducers.ReducerDefault.resolve
    if (reducer.__sync__) {
      return resolveDefault(result, _default)
    }

    return result.then(value => resolveDefault(value, _default))
  }

  return result
}

resolveReducer.thenable = (manager, accumulator, reducer) => {
  const result = resolveReducer(manager, accumulator, reducer)
  return reducer.__sync__ ? thenable(result) : result
}

module.exports.resolve = resolveReducer
