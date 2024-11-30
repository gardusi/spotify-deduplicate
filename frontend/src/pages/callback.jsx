import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Callback() {
    const navigate = useNavigate()

    useEffect(() => {
        // Get query parameters from the URL
        const params = new URLSearchParams(window.location.search)
        const authCode = params.get('code')
        const error = params.get('error')
        const state = params.get('state')
        const savedState = getCookie('spotify_auth_state')

        if (error) {
            navigate('/login')
        } else if (authCode) {
            if (state !== savedState) {
                console.error('State mismatch error', state, savedState);
                navigate('/login'); // Redirect user on state mismatch
                return;
            }
            fetch(`http://localhost:8888/token?code=${authCode}&state=${state}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.access_token) {
                        localStorage.setItem('spotifyToken', data.access_token)
                        navigate('/')
                    }
                })
                .catch(err => {
                    console.error('Error exchanging token:', err)
                    navigate('/login')
                })
        }
    }, [])

    return <div>Processing Spotify login...</div>
}

// Helper to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export default Callback