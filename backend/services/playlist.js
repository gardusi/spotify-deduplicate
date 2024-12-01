const { iterate } = require('../../helpers/iterate')

const createPlaylistService = (profileClient) => {

  const findAll = async () => {
    const limit = 50
    return iterate(
      limit,
      async (offset) => profileClient.findPlaylists({ limit, offset }),
    )
  }
  
  const findTracks = async (href) => {
    const limit = 100
    return iterate(
      limit,
      async (offset) => profileClient.findPlaylistTracks(href, { limit, offset }),
    )
  }

  return { findAll, findTracks }
}

module.exports = { createPlaylistService }
