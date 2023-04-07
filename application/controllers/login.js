const { config } = require('../config')
const { authStateKey } = require('../constants')
const querystring = require('querystring')
const generateRandomString = require('../random')

const loginController = (_, res) => {
  const state = generateRandomString(16)

  res.cookie(authStateKey, state)
  res.redirect(config.spotify.urls.auth + '/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.spotify.clientId,
      scope: config.spotify.permissions.join(' '),
      redirect_uri: config.spotify.getRedirectUri(),
      state,
  }))
}

module.exports = { loginController }
