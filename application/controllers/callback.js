const request = require('request')
const { config } = require('../config')
const { authStateKey } = require('../constants')
const querystring = require('querystring')
const { httpClient } = require('../clients/http')

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
    const options = {
      url: config.spotify.urls.auth + '/api/token',
      form: {
        code: code,
        redirect_uri: config.spotify.getRedirectUri(),
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': config.spotify.getAuthorization(),
      },
      json: true
    }

    try {
      const { access_token, refresh_token } = await httpClient.post(options, 'Failed to authorize API access')

      var options2 = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      }

      // use the access token to access the Spotify Web API
      request.get(options2, function(error, response, body) {
        console.log(body)
      })

      // we can also pass the token to the browser to make requests from there
      res.redirect('/#' + querystring.stringify({ access_token, refresh_token }))
    } catch (err) {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
    }
  }
}

module.exports = { callbackController }
