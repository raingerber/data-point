'use strict'

const PromiseArray = require('../../utils/promise-array')

/**
 * @param {Accumulator} acc
 * @returns {boolean}
 */
const isDone = acc => !!acc

/**
 *
 * @param {any} caseStatements
 * @param {any} acc
 * @param {any} resolveTransform
 * @returns
 */
function getMatchingCaseStatement (caseStatements, acc, resolveTransform) {
  const resolver = (acc, statement) => {
    return resolveTransform(acc, statement.case).then(acc => {
      return acc.value ? statement : false
    })
  }

  return PromiseArray.map(caseStatements, { resolver, isDone })(acc)
}

module.exports.getMatchingCaseStatement = getMatchingCaseStatement

function resolve (acc, resolveTransform) {
  const selectControl = acc.reducer.spec.select
  const caseStatements = selectControl.cases
  const defaultTransform = selectControl.default

  return getMatchingCaseStatement(caseStatements, acc, resolveTransform).then(
    caseStatement => {
      if (caseStatement) {
        return resolveTransform(acc, caseStatement.do)
      }

      return resolveTransform(acc, defaultTransform)
    }
  )
}

module.exports.resolve = resolve
