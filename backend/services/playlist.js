const { iterate } = require('../../helpers/iterate')

const toPlaylistSummary = (playlist) => ({
  id: playlist.id,
  name: playlist.name,
  owner: playlist.owner?.display_name || playlist.owner?.id,
  total: playlist.items?.total ?? 0,
  itemsUrl: playlist.items?.href || null,
})

const toTrack = (entry) => {
  const item = entry?.item || entry?.track
  // Skips episodes and local files, which have no stable track ID
  if (!item || item.type !== 'track' || !item.id) {
    return null
  }
  return {
    id: item.id,
    name: item.name,
    artists: (item.artists || []).map((artist) => artist.name),
  }
}

const createPlaylistService = (profileClient) => {

  const findAll = async () => {
    const limit = 50
    const playlists = await iterate(
      limit,
      async (offset) => profileClient.findPlaylists({ limit, offset }),
    )
    return playlists
      .filter((playlist) => playlist && playlist.name !== '')
      .map(toPlaylistSummary)
  }
  
  const findTracks = async (itemsUrl) => {
    const limit = 100
    const entries = await iterate(
      limit,
      async (offset) => profileClient.findPlaylistItems(itemsUrl, { limit, offset }),
    )
    return entries.map(toTrack).filter(Boolean)
  }

  return { findAll, findTracks }
}

module.exports = { createPlaylistService }
