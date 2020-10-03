const request = require('request'); // "Request" library

const runQuery = (options, errorMessage) => new Promise((resolve, reject) =>
  request.get(options, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      reject({
        statusCode: response.statusCode,
        message: errorMessage,
      });

      return;
    }
    resolve(body);
  }),
);

module.exports = runQuery;
