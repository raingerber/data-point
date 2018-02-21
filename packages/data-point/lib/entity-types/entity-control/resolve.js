const Promise = require('bluebird')

/**
 * @param {Array} caseStatements
 * @param {Accumulator} acc
 * @param {Function} resolveReducer
 * @return {Promise}
 */
function getMatchingCaseStatement (caseStatements, acc, resolveReducer) {
  return Promise.reduce(
    caseStatements,
    (result, statement) => {
      if (result) {
        // doing this until proven wrong :)
        const err = new Error('bypassing')
        err.name = 'bypass'
        err.bypass = true
        err.bypassValue = result
        return Promise.reject(err)
      }

      return resolveReducer(acc, statement.case).then(res => {
        return res.value ? statement : false
      })
    },
    null
  ).catch(error => {
    // checking if this is an error to bypass the `then` chain
    if (error.bypass === true) {
      return error.bypassValue
    }

    throw error
  })
}
module.exports.getMatchingCaseStatement = getMatchingCaseStatement

/**
 * @param {Accumulator} accumulator
 * @param {Function} resolveReducer
 * @return {Promise}
 */
function resolve (accumulator, resolveReducer) {
  const selectControl = accumulator.reducer.spec.select
  const caseStatements = selectControl.cases
  const defaultTransform = selectControl.default
  return getMatchingCaseStatement(
    caseStatements,
    accumulator,
    resolveReducer
  ).then(caseStatement => {
    if (caseStatement) {
      return resolveReducer(accumulator, caseStatement.do)
    }

    return resolveReducer(accumulator, defaultTransform)
  })
}

module.exports.resolve = resolve
