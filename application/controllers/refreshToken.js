const { spotifyAuthClient } = require('../clients/spotify/auth')

const refreshTokenController = async (req, res) => {
  // requesting access token from refresh token
  const refreshToken = req.query.refresh_token
  const { access_token } = await spotifyAuthClient().refresh(refreshToken)

  res.send({ access_token })
}

module.exports = { refreshTokenController }
