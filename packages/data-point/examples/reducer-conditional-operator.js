const dataPoint = require('../').create()
const assert = require('assert')

const people = [
  {
    name: 'Luke Skywalker',
    swapiId: '1'
  },
  {
    name: 'Yoda',
    swapiId: null
  }
]

dataPoint.addEntities({
  'request:getPerson': {
    url: 'https://swapi.co/api/people/{value}'
  },
  'transform:getPerson': {
    name: '$name',
    // request:getPerson will only
    // be executed if swapiId is
    // not false, null or undefined
    birthYear: '$swapiId | ?request:getPerson | $birth_year'
  }
})

dataPoint.transform('transform:getPerson[]', people).then(acc => {
  assert.deepEqual(acc.value, [
    {
      name: 'Luke Skywalker',
      birthYear: '19BBY'
    },
    {
      name: 'Yoda',
      birthYear: undefined
    }
  ])
})