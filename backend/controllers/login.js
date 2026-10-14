const { config } = require('../../project/config')
const { authStateKey } = require('../../project/constants')
const generateRandomString = require('../../helpers/random')

const loginController = (_, res) => {
  const state = generateRandomString(16)

  res.cookie(authStateKey, state)
  res.redirect(config.spotify.urls.auth + '/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: config.spotify.clientId,
      scope: config.spotify.permissions.join(' '),
      redirect_uri: config.spotify.getRedirectUri(),
      state,
  }))
}

module.exports = { loginController }
