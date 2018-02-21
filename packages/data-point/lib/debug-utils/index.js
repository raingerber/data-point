/**
 * @param {Reducer|String} parent
 * @param {String|Number} id
 * @return {Object}
 */
function createTreeNode (parent, id) {
  const node = { parent }
  if (id || id === 0) {
    node.id = id
  }

  return node
}

module.exports.createTreeNode = createTreeNode
