const { config } = require('../../../project/config')
const { httpClient } = require('../http')

const API_VERSION = 'v1'

const spotifyApiClient = (session, baseUrl = config.spotify.urls.api) => {
  const buildOptions = (endpoint) => ({
    url: `${baseUrl}/${API_VERSION}/${endpoint}`,
    headers: {
      'Authorization': session.getBearerAuth(), 
    },
    json: true,
  })

  const getOwnProfile = async () => {
    const options = buildOptions('me')
    const response = await httpClient.get(options, 'Failed to get own profile')
    return response
  }

  const findPlaylists = async ({ limit, offset }) => {
    const options = buildOptions(`me/playlists?limit=${limit}&offset=${offset}`)
    const response = await httpClient.get(options, 'Failed to find playlists')
    return response
  }

  // Since the February 2026 API changes, playlist contents live under `items`
  // (formerly `tracks`) and are only returned for playlists the user owns or collaborates on
  const findPlaylistItems = async (itemsUrl, { limit, offset }) => {
    if (!itemsUrl.startsWith(baseUrl)) {
      throw new Error('Invalid playlist URL')
    }
    const options = {
      ...buildOptions(),
      url: `${itemsUrl}?limit=${limit}&offset=${offset}`,
    }
    const response = await httpClient.get(options, 'Failed to find playlist items')
    return response
  }

  return { getOwnProfile, findPlaylists, findPlaylistItems }
}

module.exports = { spotifyApiClient }
