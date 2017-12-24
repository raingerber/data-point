const dataPoint = require('../').create()

dataPoint.addEntities({
  'request:searchPeople': {
    url: 'https://swapi.co/api/people/?search=r2',
    options: {
      qs: {
        // because the key starts with $
        // it will be treated as a ReducerExpression
        $search: acc => {
          return acc.value.search
        }
      }
    }
  }
})

// second parameter to transform is the initial acc value
dataPoint
  .transform('request:searchPeople', {
    search: 'r2'
  })
  .then(acc => {
    // R2-D2
    console.log(acc.value.results[0].name)
  })
