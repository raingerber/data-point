/**
 * @param {Reducer} parent
 * @param {string} id
 * @return {Object}
 */
function createNode (parent, id) {
  const node = { parent }
  if (id) {
    node.id = id
  }

  return node
}

module.exports.createNode = createNode
