const reducers = require('../utils/reducers')
const { assign } = require('../../lib').helpers

module.exports = {
  'request:a0.1': {
    url: 'http://some.path',
    options: [
      () => ({
        dataType: 'json',
        method: 'POST',
        timeout: 1000,
        username: '$username$'
      }),
      assign({
        password: value => '$password$',
        qs: {
          varKey1: value => 'someValue',
          varKey2: () => 1,
          varKey3: () => true
        }
      })
    ]
  },
  'request:a1': {
    url: 'http://remote.test/source1'
  },
  'request:a1.0': {
    url: '{values.server}/source1'
  },
  'request:a1.1': {
    url: 'http://remote.test/source2'
  },
  'request:a1.2': {
    url: 'http://remote.test/source3'
  },
  'request:a1.3': {
    url: 'http://remote.test/source4'
  },
  'request:a1.4': {
    value: () => ({ source: 'source5' }),
    url: 'http://remote.test/{value.source}'
  },
  'request:a2': {
    url: 'http://remote.test',
    options: {
      url: options => options.url + '/source1'
    }
  },
  'request:a3': {
    url: 'http://remote.test',
    options: {
      url: (options, acc) => acc.url + acc.initialValue.itemPath
    }
  },
  'request:a3.2': {
    url: 'http://remote.test{locals.itemPath}'
  },
  'request:a3.3': {
    url: 'http://remote.test{initialValue.itemPath}'
  },
  'request:a4': {
    url: 'source1',
    options: {
      baseUrl: () => 'http://remote.test'
    }
  },
  'request:a5': {
    url: 'http://remote.test/a5',
    before: reducers.addQueryVar('varKey2', 'someValue2'),
    options: {
      query: {
        varKey1: () => 'someValue1'
      }
    }
  },
  'request:a6': {
    url: 'http://remote.test/a6',
    after: reducers.addKeyValue('testKey', 'testValue')
  },
  'request:a7.1': {
    url: 'http://remote.test/a7',
    error: reducers.sourceErrorDoNothing()
  },
  'request:a7.2': {
    url: 'http://remote.test/a7',
    error: reducers.sourceErrorGraceful()
  },
  'request:a8.1': {
    url: 'source1',
    options: {
      baseUrl: () => 'http://remote.test'
    }
  },
  'request:a9': {
    url: 'http://remote.test/source1',
    options: {
      auth: {
        user: () => 'cool_user',
        pass: () => 'super_secret!'
      }
    }
  }
}
