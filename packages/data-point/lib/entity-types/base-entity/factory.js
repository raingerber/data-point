const deepFreeze = require('deep-freeze')

const { normalizeTypeCheckSource } = require('../../helpers/type-check-helpers')

/**
 * @param {Function} createReducer
 * @param {Function} Factory - factory function to create the entity
 * @param {Object} spec
 * @param {string} entityId
 */
function create (createReducer, Factory, spec, entityId) {
  const entity = new Factory(spec)

  entity.id = entityId

  // TODO this is a placeholder because we don't have the ReducerEntity beforehand
  const parent = entityId

  if (spec.before) {
    entity.before = createReducer(spec.before, { parent, id: 'before' })
  }

  if (spec.value) {
    entity.value = createReducer(spec.value, { parent, id: 'value' })
  }

  if (spec.after) {
    entity.after = createReducer(spec.after, { parent, id: 'after' })
  }

  if (spec.error) {
    entity.error = createReducer(spec.error, { parent, id: 'error' })
  }

  if (spec.inputType) {
    const inputType = normalizeTypeCheckSource(spec.inputType)
    entity.inputType = createReducer(inputType, { parent, id: 'inputType' })
  }

  if (spec.outputType) {
    const outputType = normalizeTypeCheckSource(spec.outputType)
    entity.outputType = createReducer(outputType, { parent, id: 'outputType' })
  }

  entity.params = deepFreeze(spec.params || {})
  return entity
}

module.exports.create = create
