const express = require('express')
const { tokenController } = require('../controllers/token')
const { loginController } = require('../controllers/login')
const { refreshTokenController } = require('../controllers/refreshToken')

const router = express.Router()

router.get('/login', loginController)
router.get('/token', tokenController)
router.get('/refresh_token', refreshTokenController)

module.exports = { authRouter: router }
