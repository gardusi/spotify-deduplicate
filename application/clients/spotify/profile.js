const { config } = require('../../config')
const { httpClient } = require('../http')

const spotifyProfileClient = (session, baseUrl = config.spotify.urls.api) => {

  const buildOptions = (endpoint) => ({
    url: `${baseUrl}/v1/me${endpoint}`,
    headers: {
      'Authorization': session.getBearerAuth(), 
    },
    json: true,
  })

  const getOwnProfile = async () => {
    const options = buildOptions('/')
    const response = await httpClient.get(options, "Failed to get own profile")
    return response
  }

  const findPlaylists = async ({ limit, offset }) => {
    const options = buildOptions(`/playlists?limit=${limit}&offset=${offset}`)
    const response = await httpClient.get(options, "Failed to find playlists")
    return response
  }

  return { getOwnProfile, findPlaylists }
}

module.exports = { spotifyProfileClient }