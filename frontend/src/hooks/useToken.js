const useToken = (params, navigate) => {
    const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
        return null
    }

    const fetchToken = async () => {
        const response = await fetch(`http://localhost:8888/token?code=${authCode}&state=${state}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })

        const data = await response.json()
        if (data.access_token) {
            localStorage.setItem('spotifyToken', data.access_token)
            localStorage.setItem('spotifyRefreshToken', data.refresh_token)
            navigate('/')
        }
    }

    // Get query parameters from the URL
    const authCode = params.get('code')
    const error = params.get('error')
    const state = params.get('state')
    const savedState = getCookie('spotify_auth_state')
    
    if (error || !authCode || state !== savedState) {
        console.error('Failed to exchange token:', error, state, savedState)
        navigate('/login')
        return
    }

    fetchToken().catch((error) => {
        console.error('Failed to exchange token:', error)
        navigate('/login')
    })
}

export default useToken
