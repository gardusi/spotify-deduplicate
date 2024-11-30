import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('spotifyToken')) {
      navigate('/login')
    }  
  }, [])
  
  return (
    <div>
      Nice!
    </div>
  )
}
  

export default Home
