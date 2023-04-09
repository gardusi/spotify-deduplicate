const request = require('request')
const { config } = require('../config')
const { authStateKey } = require('../constants')
const querystring = require('querystring')
const { spotifyAuthClient } = require('../clients/spotify/auth')

const callbackController = async (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null
  var state = req.query.state || null
  var storedState = req.cookies ? req.cookies[authStateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    res.clearCookie(authStateKey)
    try {
      const { access_token, refresh_token } = await spotifyAuthClient().authorize(code)

      // we can also pass the token to the browser to make requests from there
      res.redirect('/#' + querystring.stringify({ access_token, refresh_token }))
    } catch (err) {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
    }
  }
}

module.exports = { callbackController }
