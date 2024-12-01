const config = {
  frontendUrl: 'http://localhost:3000',
  port: 8888,
  spotify: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    permissions: ['user-read-private', 'user-read-email'],
    urls: {
      auth: 'https://accounts.spotify.com',
      api: 'https://api.spotify.com',
    },
    getRedirectUri: () => `${config.frontendUrl}/callback/`,
    getBasicAuth: () => {
      return `Basic ${Buffer.from(config.spotify.clientId + ':' + process.env.CLIENT_SECRET).toString('base64')}`
    },
  }
}

module.exports = { config }
