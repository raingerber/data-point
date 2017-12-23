/*
NOTE: exporting the resolve function here created a circular dependency when it was
imported by reducer-entity/resolve.js -- to avoid this problem, that file now imports
the resolve function directly from base-entity/resolve.js
*/

module.exports = {
  create: require('./factory').create
}
