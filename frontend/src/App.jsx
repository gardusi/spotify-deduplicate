import React from 'react'
import './assets/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import Home from './pages/home'
import Login from './pages/login'
import Callback from './pages/callback'

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route element={<Login />} path="/login"/>
          <Route element={<Callback />} path="/callback"/>
          <Route element={<Home />} path="/"/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
