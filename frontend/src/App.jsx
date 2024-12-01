import React from 'react'
import './assets/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/login'
import Callback from './pages/callback'

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route exact element={<Login />} path="/login"/>
          <Route exact element={<Callback />} path="/callback"/>
          <Route exact element={<Home />} path="/"/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
