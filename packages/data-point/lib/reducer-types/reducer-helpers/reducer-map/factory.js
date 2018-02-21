const { createNode } = require('../../../debug-utils')

const REDUCER_MAP = 'ReducerMap'

module.exports.type = REDUCER_MAP

const HELPER_NAME = 'map'

module.exports.name = HELPER_NAME

/**
 * @class
 * @property {string} type
 * @property {reducer} reducer
 */
function ReducerMap () {
  this.type = REDUCER_MAP
  this.reducer = undefined
}

module.exports.Constructor = ReducerMap

/**
 * @param {Function} createReducer
 * @param {*} source - raw source for a reducer
 * @param {Map} tree
 * @return {ReducerMap}
 */
function create (createReducer, source, tree) {
  const reducer = new ReducerMap()
  reducer.reducer = createReducer(source, { tree })
  tree && tree.set(reducer.reducer, createNode(reducer))

  return reducer
}

module.exports.create = create
