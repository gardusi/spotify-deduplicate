const express = require('express')
const { callbackController } = require('../controllers/callback')
const { loginController } = require('../controllers/login')
const { refreshTokenController } = require('../controllers/refreshToken')

const authRouter = express.Router()

authRouter.get('/login', loginController)
authRouter.get('/callback', callbackController)
authRouter.get('/refresh_token', refreshTokenController)

module.exports = { authRouter }
