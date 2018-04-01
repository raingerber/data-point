const REDUCER_SYNC = 'ReducerSync'

module.exports.type = REDUCER_SYNC

const HELPER_NAME = 'sync'

module.exports.name = HELPER_NAME

// TODO this won't work when the function has already been promisified

/**
 * @param {Function} createReducer
 * @param {*} source
 * @return {reducer}
 */
function create (createReducer, source) {
  const reducer = createReducer(source)
  reducer.__sync__ = true
  return reducer
}

module.exports.create = create
