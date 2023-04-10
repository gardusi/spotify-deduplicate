const { createSession } = require('./manager')

const sessionMiddleware = () => (req, _, next) => {
  const session = createSession()
  if (req.headers.access_token) {
    session.putAccessToken(req.headers.access_token)
  }
  req.session = session
  next()
}

module.exports = { sessionMiddleware }
