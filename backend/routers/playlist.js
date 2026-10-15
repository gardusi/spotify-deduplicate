const express = require('express') // Express web server framework
const { findDuplicatesController } = require('../controllers/findDuplicates')
const { listPlaylistsController } = require('../controllers/listPlaylists')

const router = express.Router()

router.get('/playlists', listPlaylistsController)
router.post('/find-duplicates', express.json(), findDuplicatesController)

module.exports = { playlistRouter: router }
