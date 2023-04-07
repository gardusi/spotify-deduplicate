const config = {
  host: 'http://localhost',
  port: 8888,
  spotify: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    permissions: ['user-read-private', 'user-read-email'],
    urls: {
      auth: 'https://accounts.spotify.com',
      api: 'https://api.spotify.com',
    },
    getRedirectUri: () => `${config.host}:${config.port}${process.env.REDIRECT_ENDPOINT}/`,
    getBasicAuth: () => {
      return `Basic ${new Buffer(config.spotify.clientId + ':' + process.env.CLIENT_SECRET).toString('base64')}`
    },
  }
}

module.exports = { config }
