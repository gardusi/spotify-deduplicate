const express = require('express')
const { callbackController } = require('../controllers/callback')
const { loginController } = require('../controllers/login')
const { refreshTokenController } = require('../controllers/refreshToken')

const router = express.Router()

router.get('/login', loginController)
router.get('/callback', callbackController)
router.get('/refresh_token', refreshTokenController)

module.exports = { authRouter: router }
