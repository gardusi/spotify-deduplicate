const env = require('dotenv')
env.config({ quiet: true })

const { app } = require('./app')
console.log('Listening on 8888')
app.listen(8888)
