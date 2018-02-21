const { createNode } = require('../../../debug-utils')

const REDUCER_ASSIGN = 'ReducerAssign'

module.exports.type = REDUCER_ASSIGN

const HELPER_NAME = 'assign'

module.exports.name = HELPER_NAME

/**
 * @class
 * @property {string} type
 * @property {Reducer} reducer
 */
function ReducerAssign () {
  this.type = REDUCER_ASSIGN
  this.reducer = undefined
}

module.exports.ReducerAssign = ReducerAssign

/**
 * @param {Function} createReducer
 * @param {*} source - raw source for a reducer
 * @param {Map} tree
 * @return {ReducerAssign}
 */
function create (createReducer, source, tree) {
  const reducer = new ReducerAssign()
  reducer.reducer = createReducer(source)
  tree && tree.set(reducer.reducer, createNode(reducer))

  return reducer
}

module.exports.create = create
