const express = require('express') // Express web server framework
const { findDuplicatesController } = require('../controllers/findDuplicates')

const router = express.Router()

router.get('/playlists', findDuplicatesController)

module.exports = { playlistRouter: router }
