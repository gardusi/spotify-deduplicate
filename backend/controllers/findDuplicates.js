const { spotifyApiClient } = require('../clients/spotify/api')
const { CATEGORIES, findDuplicates } = require('../duplicates')
const { createPlaylistService } = require('../services/playlist')

// Body: { categories: { [playlistId]: 'feeling' | 'genre' | ... } }
// Categories other than feeling and genre (e.g. compilation) are never checked
const findDuplicatesController = async (req, res) => {
  const categories = req.body?.categories
  if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
    res.status(400)
    res.send({ error: 'Expected a "categories" object mapping playlist IDs to categories' })
    return
  }

  const playlistService = createPlaylistService(spotifyApiClient(req.session))

  try {
    const playlists = await playlistService.findAll()
    const selected = playlists.filter((playlist) =>
      playlist.itemsUrl && CATEGORIES.includes(categories[playlist.id]))

    const classifiedTracks = await Promise.all(selected.map(async (playlist) => ({
      playlist,
      category: categories[playlist.id],
      tracks: await playlistService.findTracks(playlist.itemsUrl),
    })))

    res.send({
      scannedPlaylists: selected.length,
      duplicates: findDuplicates(classifiedTracks),
    })
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500)
    res.send({ error: err.message })
  }
}

module.exports = { findDuplicatesController }
