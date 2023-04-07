const express = require('express')
const { authRouter } = require('./routers/auth')

const serveStatic = express.static(__dirname + '/landing/')

const app = express()

const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(serveStatic)

app.use(cors())
app.use(cookieParser())

app.use(authRouter);
app.use(require('./playlist'));

module.exports = { app }
