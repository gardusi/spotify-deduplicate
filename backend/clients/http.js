const send = async (method, { url, headers = {}, json, form }, errorMessage) => {
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
