const { accessTokenKey } = require("../constants")

const createSession = () => {
  const session = {}

  const get = (key) => {
    const entry = session[key]
    if (entry && entry.expiresAt > Date.now()) {
      return entry.value
    }
    delete session[key]
  }

  const put = (key, value, ttl) => {
    session[key] = {
      value,
      expiresAt: Date.now() + ttl,
    }
  }

  const putAccessToken = (accessToken, ttl = 3600000) => {
    put(accessTokenKey, accessToken, ttl)
  }

  const getBearerAuth = () => `Bearer ${get(accessTokenKey)}`

  return { putAccessToken, getBearerAuth }
}

module.exports = { createSession }
