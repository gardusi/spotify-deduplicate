import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken from '../hooks/useToken'

function Callback() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        useToken(params, navigate)
    }, [])

    return <div>Processing Spotify login...</div>
}

export default Callback
