const { createNode } = require('../../../debug-utils')

const REDUCER_FIND = 'ReducerFind'

module.exports.type = REDUCER_FIND

const HELPER_NAME = 'find'

module.exports.name = HELPER_NAME

/**
 * @class
 * @property {string} type
 * @property {Reducer} reducer
 */
function ReducerFind () {
  this.type = REDUCER_FIND
  this.reducer = undefined
}

module.exports.ReducerFind = ReducerFind

/**
 * @param {Function} createReducer
 * @param {*} source - raw source for a reducer
 * @param {Map} tree
 * @return {ReducerFind}
 */
function create (createReducer, source, tree) {
  const reducer = new ReducerFind()
  reducer.reducer = createReducer(source)
  tree && tree.set(reducer.reducer, createNode(reducer))

  return reducer
}

module.exports.create = create
