const express = require('express') // Express web server framework
const { findDuplicatesController } = require('../controllers/findDuplicates')

const router = express.Router()

router.get('/find-duplicates', findDuplicatesController)

module.exports = { playlistRouter: router }
