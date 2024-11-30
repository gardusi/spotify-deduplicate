const { authStateKey } = require('../../project/constants')
const { spotifyAuthClient } = require('../clients/spotify/auth')

const tokenController = async (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[authStateKey] : null

  if (state === null || state !== storedState) {
    res.send({ error: 'state_mismatch' })
  } else {
    res.clearCookie(authStateKey)
    try {
      const { access_token, refresh_token } = await spotifyAuthClient().authorize(code)
      res.send({ access_token, refresh_token })
    } catch (err) {
      res.send({ error: 'invalid_token' })
    }
  }
}

module.exports = { tokenController }
