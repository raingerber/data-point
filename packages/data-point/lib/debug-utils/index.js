/**
 * @param {Reducer} parent
 * @param {String|Number} id
 * @return {Object}
 */
function createNode (parent, id) {
  const node = {}
  if (parent) {
    node.parent = parent
  }

  if (id || id === 0) {
    node.id = id
  }

  return node
}

module.exports.createNode = createNode
