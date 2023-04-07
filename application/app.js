const express = require('express')
const { authRouter } = require('./routers/auth')
const { playlistRouter } = require('./routers/playlist')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { sessionMiddleware } = require('./session/middleware')

const serveStatic = express.static(__dirname + '/landing/')

const app = express()

app.use(serveStatic)

app.use(cors())
app.use(cookieParser())
app.use(sessionMiddleware())

app.use(authRouter)
app.use(playlistRouter)

module.exports = { app }
