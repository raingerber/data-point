const { createNode } = require('../../../debug-utils')

const REDUCER_FILTER = 'ReducerFilter'

module.exports.type = REDUCER_FILTER

const HELPER_NAME = 'filter'

module.exports.name = HELPER_NAME

/**
 * @class
 * @property {string} type
 * @property {Reducer} transform
 */
function ReducerFilter () {
  this.type = REDUCER_FILTER
  this.transform = undefined
}

module.exports.ReducerFilter = ReducerFilter

/**
 * @param {Function} createReducer
 * @param {*} source - raw source for a reducer
 * @param {Map} tree
 * @return {ReducerFilter}
 */
function create (createReducer, source, tree) {
  const reducer = new ReducerFilter()
  reducer.reducer = createReducer(source)
  tree && tree.set(reducer.reducer, createNode(reducer))

  return reducer
}

module.exports.create = create
