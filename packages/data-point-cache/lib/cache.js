const RedisClient = require('./redis-client')
const InMemory = require('./in-memory')
const Promise = require('bluebird')

const ms = require('ms')

const DefaultSettings = {
  localTTL: ms('2s')
}

function set (cache, key, value, ttl = '20m') {
  const ttlms = ms(ttl)
  return cache.redis
    .set(key, value, ttlms)
    .then(res => cache.local.set(key, value, cache.settings.localTTL))
}

function getFromStore (cache, key) {
  return Promise.resolve(cache.local.get(key)).then(entry => {
    // if we still have it sotred locally return the value, skip everything else
    if (typeof entry !== 'undefined') {
      return entry
    }
    // if no longer in local memory, then get from redis
    return cache.redis.get(key).then(value => {
      // could be a race condition where by the time we get here the value
      // already was revemoved, so then skip local cache and move on
      if (typeof value === 'undefined') {
        return
      }

      cache.local.set(key, value, cache.settings.localTTL)

      return value
    })
  })
}

function get (cache, key) {
  return cache.redis.exists(key).then(exists => {
    if (exists) {
      return getFromStore(cache, key)
    }
    return cache.local.del(key)
  })
}

function bootstrapAPI (cache) {
  cache.set = set.bind(null, cache)
  cache.get = get.bind(null, cache)
  return cache
}

function create (options) {
  const settings = Object.assign({}, DefaultSettings, options)
  const Cache = {
    settings,
    redis: null,
    local: null,
    set: null,
    get: null
  }
  return Promise.resolve(Cache)
    .then(cache => {
      return RedisClient.create(cache.settings).then(redis => {
        cache.redis = redis
        return cache
      })
    })
    .then(cache => {
      cache.local = InMemory.create()
      return cache
    })
    .then(bootstrapAPI)
}

module.exports = {
  create,
  bootstrapAPI,
  set,
  get
}
