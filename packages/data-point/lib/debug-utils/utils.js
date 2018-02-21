/**
 * @param {Reducer} parent
 * @param {Array} id // TODO isn't this a string?
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
