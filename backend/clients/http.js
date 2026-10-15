const MAX_RETRIES = 3

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const send = async (method, { url, headers = {}, json, form }, errorMessage, attempt = 0) => {
  let response
  try {
    response = await fetch(url, {
      method,
      headers: {
        ...(json ? { 'Accept': 'application/json' } : {}),
        ...headers,
      },
      body: form ? new URLSearchParams(form) : undefined,
    })
  } catch (error) {
    throw { statusCode: 502, message: errorMessage }
  }

  // Spotify rate limits bursts of requests and tells how long to back off
  if (response.status === 429 && attempt < MAX_RETRIES) {
    const retryAfter = Number(response.headers.get('Retry-After')) || 1
    await wait(retryAfter * 1000)
    return send(method, { url, headers, json, form }, errorMessage, attempt + 1)
  }

  if (response.status !== 200) {
    throw { statusCode: response.status, message: errorMessage }
  }

  return json ? response.json() : response.text()
}

const httpClient = {
  get: (options, errorMessage) => send('GET', options, errorMessage),
  post: (options, errorMessage) => send('POST', options, errorMessage),
}

module.exports = { httpClient }
