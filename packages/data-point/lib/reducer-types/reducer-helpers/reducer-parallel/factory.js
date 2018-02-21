const { createNode } = require('../../../debug-utils')

const REDUCER_PARALLEL = 'ReducerParallel'

module.exports.type = REDUCER_PARALLEL

const HELPER_NAME = 'parallel'

module.exports.name = HELPER_NAME

/**
 * @class
 * @property {string} type
 * @property {Array<reducer>} reducers
 */
function ReducerParallel () {
  this.type = 'ReducerParallel'
  this.reducers = []
}

module.exports.Constructor = ReducerParallel

/**
 * @param {Function} createReducer
 * @param {Array} source
 * @param {Map} tree
 * @return {Reducer}
 */
function create (createReducer, source, tree) {
  const reducers = source.map(token => {
    return createReducer(token, { tree })
  })

  const reducer = new ReducerParallel()
  reducer.reducers = reducers
  tree &&
    reducers.forEach((r, index) => {
      tree.set(r, createNode(reducer, index))
    })

  return reducer
}

module.exports.create = create
