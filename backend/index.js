const env = require('dotenv')
env.config()

const { app } = require('./app')
console.log('Listening on 8888')
app.listen(8888)
