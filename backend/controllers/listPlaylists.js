const { spotifyApiClient } = require('../clients/spotify/api')
const { createPlaylistService } = require('../services/playlist')

const listPlaylistsController = async (req, res) => {
  const playlistService = createPlaylistService(spotifyApiClient(req.session))

  try {
    const playlists = await playlistService.findAll()
    res.send({
      playlists: playlists.map(({ itemsUrl, ...playlist }) => ({
        ...playlist,
        readable: itemsUrl !== null,
      })),
    })
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500)
    res.send({ error: err.message })
  }
}

module.exports = { listPlaylistsController }
