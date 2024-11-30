const express = require('express')
const { authRouter } = require('./routers/auth')
const { playlistRouter } = require('./routers/playlist')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { sessionMiddleware } = require('./session/middleware')
const { config } = require('../project/config')

const app = express()

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}))
app.use(cookieParser())
app.use(sessionMiddleware())

app.use(authRouter)
app.use(playlistRouter)

module.exports = { app }
