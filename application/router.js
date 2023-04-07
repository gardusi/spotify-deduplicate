const express = require('express')
const { auth } = require('./routes/auth')

const serveStatic = express.static(__dirname + '/landing/')

const app = express()

const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(serveStatic)

app.use(cors())
app.use(cookieParser())

app.use(auth());
app.use(require('./playlist'));

module.exports = { app }

