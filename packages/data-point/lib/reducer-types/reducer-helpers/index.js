const createStub = require('./reducer-stub').create

const reducerAssign = require('./reducer-assign')
const reducerConstant = require('./reducer-constant')
const reducerFilter = require('./reducer-filter')
const reducerFind = require('./reducer-find')
const reducerMap = require('./reducer-map')
const reducerOmit = require('./reducer-omit')
const reducerParallel = require('./reducer-parallel')
const reducerPick = require('./reducer-pick')

/*
"Reducer helpers" are functions that create reducers.

They generate a ReducerStub, which is a temporary
object that is later used to generate a reducer:

// first, the user creates a ReducerStub

const reducer = ReducerStub('filter', '$a.b')

// then, when the stub is passed to transform,
// it will be used to generate a reducer object

dp.transform(reducer, data)

The helpers exposed on DataPoint are the ReducerStub
function bound to a string identifier using bindStubFunction
*/

module.exports.isType = require('./reducer-stub').isType

const reducers = {
  [reducerAssign.type]: reducerAssign,
  [reducerConstant.type]: reducerConstant,
  [reducerFilter.type]: reducerFilter,
  [reducerFind.type]: reducerFind,
  [reducerMap.type]: reducerMap,
  [reducerOmit.type]: reducerOmit,
  [reducerParallel.type]: reducerParallel,
  [reducerPick.type]: reducerPick
}

module.exports.reducers = reducers

function bindStubFunction (reducerType) {
  return createStub.bind(null, reducerType)
}

const stubFactories = {
  [reducerAssign.name]: bindStubFunction(reducerAssign.type),
  [reducerConstant.name]: bindStubFunction(reducerConstant.type),
  [reducerFilter.name]: bindStubFunction(reducerFilter.type),
  [reducerFind.name]: bindStubFunction(reducerFind.type),
  [reducerMap.name]: bindStubFunction(reducerMap.type),
  [reducerOmit.name]: bindStubFunction(reducerOmit.type),
  [reducerParallel.name]: bindStubFunction(reducerParallel.type),
  [reducerPick.name]: bindStubFunction(reducerPick.type)
}

module.exports.stubFactories = stubFactories

/**
 * @param {Function} createReducer
 * @param {ReducerStub} stub
 * @param {Map} tree
 * @returns {Reducer}
 */
function createFromStub (createReducer, stub, tree) {
  const args = [createReducer].concat(stub.args, tree)
  return reducers[stub.type].create.apply(null, args)
}

module.exports.create = createFromStub
