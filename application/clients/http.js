const request = require('request')

const httpClient = {
  get: (options, errorMessage) => new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject({
          statusCode: response.statusCode,
          message: errorMessage,
        })
  
        return
      }
      resolve(body)
    })
  }),

  post: (options, errorMessage) => new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject({
          statusCode: response.statusCode,
          message: errorMessage,
        })
  
        return
      }
      resolve(body)
    })
  })
}

module.exports = { httpClient }
