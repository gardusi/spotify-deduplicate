const { config } = require('../config')
const { httpClient } = require('../clients/http')

const refreshTokenController = async (req, res) => {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token
  const options = {
    url: config.spotify.urls.auth + '/api/token',
    headers: { 'Authorization': config.spotify.getAuthorization() },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  const { access_token } = await httpClient.post(options, 'Failed to refresh API access')
  res.send({ access_token })
}

module.exports = { refreshTokenController }
