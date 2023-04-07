const env = require('dotenv')
env.config()

const { app } = require('./application/router')
console.log('Listening on 8888')
app.listen(8888)
