const env = require('dotenv')
env.config()

const { app } = require('./application/app')
console.log('Listening on 8888')
app.listen(8888)
