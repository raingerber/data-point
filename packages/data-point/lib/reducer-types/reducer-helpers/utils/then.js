/**
 * @param {Function} callback
 * @return {Function}
 */
function thenSync (callback) {
  return data => callback(data)
}

/**
 * @param {Function} callback
 * @return {Function}
 */
function thenAsync (callback) {
  return promise => promise.then(callback)
}

/**
 * @param {boolean} sync
 * @param {Function} callback
 * @return {Function}
 */
function then (sync, callback) {
  const fn = sync ? thenSync : thenAsync
  return fn(callback)
  // return (sync ? thenSync : thenAsync)(callback)
}

module.exports.then = then
