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
 * @return {Reducer}
 */
function create (createReducer, source) {
  const reducer = new ReducerParallel()
  const reducers = source.map((token, index) => {
    const options = { parent: reducer, id: index }
    return createReducer(token, options)
  })

  reducer.reducers = reducers
  return reducer
}

module.exports.create = create
