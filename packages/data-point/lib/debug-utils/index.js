/**
 * @param {Reducer} parent
 * @param {string|number} id
 * @return {Object}
 */
function createNode (parent, id) {
  const node = { parent }
  if (id || id === 0) {
    node.id = id
  }

  return node
}

module.exports.createNode = createNode
