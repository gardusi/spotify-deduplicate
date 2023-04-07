const { config } = require('../../config')
const { httpClient } = require('../http')

const spotifyAuthClient = () => {

  const buildOptions = (form) => ({
    url: config.spotify.urls.auth + '/api/token',
    headers: {
      'Authorization': config.spotify.getAuthorization(),
    },
    json: true,
    form,
  })

  const authorize = async (authorizationCode) => {
    const options = buildOptions({
      code: authorizationCode,
      redirect_uri: config.spotify.getRedirectUri(),
      grant_type: 'authorization_code',
    })

    const response = await httpClient.post(options, 'Failed to authorize API access')
    return response
  }

  const refresh = async (refreshToken) => {
    const options = buildOptions({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    const response = await httpClient.post(options, 'Failed to refresh API access')
    return response
  }

  return { authorize, refresh }
}

module.exports = { spotifyAuthClient }
