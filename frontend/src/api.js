const API_URL = 'http://127.0.0.1:8888'

export class UnauthorizedError extends Error {}

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('spotifyRefreshToken')
  if (!refreshToken) return false

  const response = await fetch(`${API_URL}/refresh_token?refresh_token=${encodeURIComponent(refreshToken)}`)
  if (!response.ok) return false

  const { access_token } = await response.json()
  if (!access_token) return false
  localStorage.setItem('spotifyToken', access_token)
  return true
}

const request = async (path, { method = 'GET', body } = {}, canRetry = true) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      access_token: localStorage.getItem('spotifyToken'),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    if (canRetry && await refreshAccessToken()) {
      return request(path, { method, body }, false)
    }
    throw new UnauthorizedError('Session expired')
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`)
  }
  return data
}

export const fetchPlaylists = () => request('/playlists')

export const findDuplicates = (categories) =>
  request('/find-duplicates', { method: 'POST', body: { categories } })
