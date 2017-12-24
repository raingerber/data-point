/* eslint-env jest */
'use strict'

const _ = require('lodash')
const nock = require('nock')
const Reducer = require('./reducer')

const AccumulatorFactory = require('../../accumulator/factory')
const createTransform = require('../../reducer-types').create
const LocalsFactory = require('../../locals/factory')

const ResolveEntity = require('../base-entity/resolve')

const FixtureStore = require('../../../test/utils/fixture-store')

const helpers = require('../../helpers')

// TODO have this in helpers
const ReducerFactory = transform => {
  return createTransform(transform).reducers[0]
}

let dataPoint
let resolveTransform

function transform (entityId, value, options) {
  const reducer = dataPoint.entities.get(entityId)
  const accumulator = helpers.createAccumulator(value, {
    context: reducer,
    locals,
    values
  })
  const acc = Object.assign({}, accumulator, options)
  return Reducer.resolve(acc, resolveTransform)
}

let locals
let values

function helperMockContext (accumulatorData, reducerSource, requestName) {
  const accumulator = AccumulatorFactory.create({
    value: accumulatorData,
    locals,
    values
  })
  const reducer = ReducerFactory(reducerSource)
  return ResolveEntity.createCurrentAccumulator(dataPoint, accumulator, reducer)
}

beforeAll(() => {
  locals = LocalsFactory.create({
    itemPath: '/source1'
  })
  dataPoint = FixtureStore.create()
  resolveTransform = helpers.createResolveTransform(dataPoint)
  values = dataPoint.values.getStore()
})

beforeEach(() => {
  dataPoint.middleware.clear()
})

describe('resolveUrlInjections', () => {
  test('url with no reducer', () => {
    const value = {
      domain: 'foo.com'
    }

    const currentAccumulator = helperMockContext(
      value,
      'request:a1',
      'request:a1'
    )

    const result = Reducer.resolveUrlInjections(
      'http://{value.domain}/api',
      currentAccumulator
    )

    expect(result).toBe('http://foo.com/api')
  })
})

describe('resolveUrl', () => {
  test('It should set acc.url value', () => {
    const acc = Reducer.resolveUrl({
      reducer: {
        spec: {
          url: 'http://foo'
        }
      }
    })
    expect(acc).toHaveProperty('url', 'http://foo')
  })

  test('It should do injections', () => {
    const acc = Reducer.resolveUrl({
      value: 'bar',
      reducer: {
        spec: {
          url: 'http://foo/{value}'
        }
      }
    })
    expect(acc).toHaveProperty('url', 'http://foo/bar')
  })
})

describe('resolveOptions', () => {
  test('It should set acc.options', () => {
    const acc = _.set({}, 'reducer.spec', {
      options: {
        port: 80
      },
      transformOptionKeys: []
    })
    return Reducer.resolveOptions(acc, resolveTransform).then(result => {
      expect(result.options).toEqual({
        port: 80
      })
    })
  })

  test('It should resolve transformOptionKeys', () => {
    const acc = {
      value: {
        foo: {
          bar: 'test'
        }
      },
      reducer: {
        spec: {
          options: {
            port: 80
          },
          transformOptionKeys: [
            {
              path: 'qs.key',
              transform: helpers.createTransform('$foo.bar')
            }
          ]
        }
      }
    }
    return Reducer.resolveOptions(acc, resolveTransform).then(result => {
      expect(result.options).toEqual({
        port: 80,
        qs: {
          key: 'test'
        }
      })
    })
  })
})

describe('getRequestOptions', () => {
  test('set defaults', () => {
    expect(Reducer.getRequestOptions({})).toEqual({
      method: 'GET',
      json: true
    })

    expect(
      Reducer.getRequestOptions({
        json: false
      }).json
    ).toBe(false)

    expect(
      Reducer.getRequestOptions({
        timeout: 100
      })
    ).toEqual({
      method: 'GET',
      json: true,
      timeout: 100
    })
  })
})

describe('resolveRequest', () => {
  test('resolve reducer locals', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    const acc = {
      options: {
        json: true,
        url: 'http://remote.test/source1'
      }
    }

    return Reducer.resolveRequest(acc).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })
})

describe('inspect', () => {
  let consoleInfo
  function getAcc () {
    const acc = {}
    _.set(acc, 'reducer.spec.id', 'test:test')
    _.set(acc, 'params.inspect', true)
    return acc
  }
  beforeAll(() => {
    consoleInfo = console.info
  })
  afterEach(() => {
    console.info = consoleInfo
  })
  test('It should not execute utils.inspect', () => {
    console.info = jest.fn()
    const acc = getAcc()
    acc.params.inspect = undefined
    Reducer.inspect(acc)
    expect(console.info).not.toBeCalled()
  })
  test('It should not execute utils.inspect', () => {
    console.info = jest.fn()
    Reducer.inspect(getAcc())
    expect(console.info.mock.calls[0]).toContain('test:test')
  })
  test('It should output options', () => {
    console.info = jest.fn()
    const acc = getAcc()
    _.set(acc, 'options', { options: 1 })
    Reducer.inspect(acc)
    expect(console.info.mock.calls[0]).toContain('\noptions:')
  })
})

describe('resolve', () => {
  test('simplest json call', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    return transform('request:a1', null).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })

  test('url injections', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    return transform('request:a1.0', {}).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })

  test('beforeRequest', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    return transform('request:a2', {}).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })

  test('use contextPath', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    return transform(
      'request:a3',
      {},
      {
        initialValue: {
          itemPath: '/source1'
        }
      }
    ).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })

  test('inject locals value with string template', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    return transform(
      'request:a3.2',
      {},
      {
        locals: {
          itemPath: '/source1'
        }
      }
    ).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })

  test('inject locals value with string template', () => {
    nock('http://remote.test')
      .get('/source1')
      .reply(200, {
        ok: true
      })

    return transform('request:a4', {}).then(result => {
      expect(result.value).toEqual({
        ok: true
      })
    })
  })
})
