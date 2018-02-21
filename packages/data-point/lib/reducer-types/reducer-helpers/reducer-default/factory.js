const REDUCER_DEFAULT = 'ReducerDefault'

module.exports.type = REDUCER_DEFAULT

const HELPER_NAME = 'withDefault'

module.exports.name = HELPER_NAME

/**
 * this is used as a decorator
 * it attaches a default value
 * to an existing reducer type
 * @param {Function} createReducer
 * @param {*} source - raw source for a reducer
 * @param {*} value
 * @return {Reducer}
 */
function create (createReducer, source, value) {
  // we do not pass the parent/id in the options,
  // but the entry for this reducer in the tree
  // will get overridden later
  return createReducer(source, { default: value })
}

module.exports.create = create
